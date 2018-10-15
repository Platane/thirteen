#!/bin/bash

set -e

export STACKNAME="thirteen-bot"

(cd bot ; yarn build )

(cd api ; yarn build )

rm -rf .build
mkdir .build

# package app + deploy
aws cloudformation package \
  --template-file infrastructure/template.yml \
  --s3-bucket dunelm-template-adsiasdiias123 \
  --output-template-file .build/packaged-template.yml

aws cloudformation deploy \
  --template-file .build/packaged-template.yml \
  --stack-name $STACKNAME \
  --capabilities CAPABILITY_IAM


export GRAPHQL_ENDPOINT=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`graphqlEndpoint\`].OutputValue' --output text`

export BUCKET_NAME=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`bucketName\`].OutputValue' --output text`

export S3_URL=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`s3Url\`].OutputValue' --output text`

export APP_ORIGIN=$S3_URL

rm -rf website/.build/

(cd website ; yarn build )

# aws s3 cp --no-progress --recursive --acl "public-read" website/.build/ s3://$BUCKET_NAME

mkdir website/.build/gzip

for filename in `ls website/.build`; do

  if [[ $filename == *.html ]];
  then
    aws s3 cp --no-progress --acl "public-read" \
      --content-type "text/html" \
      "website/.build/$filename" \
      "s3://$BUCKET_NAME/$filename"

    gzip -9 -c website/.build/$filename > website/.build/gzip/$filename
    #
    aws s3 cp --no-progress --acl "public-read" \
      --content-type "text/html" \
      --content-encoding "gzip" \
      "website/.build/gzip/$filename" \
      "s3://$BUCKET_NAME/$filename"
  fi

  if [[ $filename == *.js ]];
  then
    aws s3 cp --no-progress --acl "public-read" \
      --content-type "application/javascript" \
      website/.build/$filename \
      s3://$BUCKET_NAME/$filename

    gzip -9 -c website/.build/$filename > website/.build/gzip/$filename

    aws s3 cp --no-progress --acl "public-read" \
      --content-type "application/javascript" \
      --content-encoding "gzip" \
      "website/.build/gzip/$filename" \
      "s3://$BUCKET_NAME/$filename"
  fi

  if [[ $filename == *.css ]];
  then
    aws s3 cp --no-progress --acl "public-read" \
      --content-type "text/css" \
      website/.build/$filename \
      s3://$BUCKET_NAME/$filename

    gzip -9 -c website/.build/$filename > website/.build/gzip/$filename

    aws s3 cp --no-progress --acl "public-read" \
      --content-type "text/css" \
      --content-encoding "gzip" \
      "website/.build/gzip/$filename" \
      "s3://$BUCKET_NAME/$filename"
  fi

  # if [[ -f $filename ]]; then
  #   echo "file"
  # fi

done

echo $APP_ORIGIN
