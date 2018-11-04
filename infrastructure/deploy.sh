#!/bin/bash

set -e

export STACKNAME="thirteen-bot"

(cd bot ; yarn prepare ; yarn build )

(cd api-graphql ; yarn build )

(cd api-static ; yarn build )

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

export WEBSITE_URL=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`websiteUrl\`].OutputValue' --output text`

export APP_ORIGIN=$WEBSITE_URL

export STATIC_ENDPOINT="$S3_URL/data"

rm -rf website/.build/

(cd website ; yarn build )

(cd website ; yarn build:all:page )

cp -r api-static/.build website/.build/data




cd website/.build/

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --cache-control 'max-age=31104000' \
  --exclude "*.html" \
  --exclude "*.json" \
  --exclude "*.css" \
  --exclude "*.js" \
  ./ s3://$BUCKET_NAME

rm -rf gzip
mkdir gzip


for file in `find -name "*.html" -type f -or -name "*.json" -type f -or -name "*.css" -type f -or -name "*.js" -type f`; do

  target=$(readlink -m gzip/$file )

  mkdir -p $(dirname $target)

  gzip -9 -c $file > $target
done

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=3600' \
  --exclude "*" \
  --include "*.html" \
  --content-type "text/html" \
  ./gzip/ s3://$BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=31104000' \
  --exclude "*" \
  --include "*.css" \
  --content-type "text/css" \
  ./gzip/ s3://$BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=31104000' \
  --exclude "*" \
  --include "*.json" \
  --exclude "*/index.json" \
  --content-type "application/json" \
  ./gzip/ s3://$BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=3600' \
  --exclude "*" \
  --include "*/index.json" \
  --content-type "application/json" \
  ./gzip/ s3://$BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=31104000' \
  --exclude "*" \
  --include "*.js" \
  --content-type "application/javascript" \
  ./gzip/ s3://$BUCKET_NAME


echo $WEBSITE_URL
