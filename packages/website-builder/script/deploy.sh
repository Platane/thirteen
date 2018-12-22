#!/bin/bash

set -e

rm -rf .build
mkdir .build

export STACKNAME=${STACKNAME:-'thirteen-website'}
export TEMP_BUCKET_NAME="dunelm-template-adsiasdiias123"

# package app + deploy
aws cloudformation package \
  --template-file template.yml \
  --s3-bucket dunelm-template-adsiasdiias123 \
  --output-template-file .build/packaged-template.yml

aws cloudformation deploy \
  --no-fail-on-empty-changeset \
  --template-file .build/packaged-template.yml \
  --stack-name $STACKNAME \
  --capabilities CAPABILITY_IAM


export STATIC_BUCKET_NAME=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`staticAssetBucket\`].OutputValue' --output text`

export S3_URL=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`s3Url\`].OutputValue' --output text`

export WEBSITE_URL=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`websiteUrl\`].OutputValue' --output text`

export APP_ORIGIN=$WEBSITE_URL
export STATIC_ENDPOINT="$S3_URL/data"

( cd ../../ ; yarn build:website )

cp -r ../api-static/.build ../website-builder/.build/data
cp -r ../website/.build/* ../website-builder/.build/

cd .build/

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --cache-control 'max-age=31104000' \
  --exclude "*.html" \
  --exclude "*.json" \
  --exclude "*.css" \
  --exclude "*.js" \
  ./ s3://$STATIC_BUCKET_NAME

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
  ./gzip/ s3://$STATIC_BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=31104000' \
  --exclude "*" \
  --include "*.css" \
  --content-type "text/css" \
  ./gzip/ s3://$STATIC_BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=31104000' \
  --exclude "*" \
  --include "*.json" \
  --exclude "*/index.json" \
  --content-type "application/json" \
  ./gzip/ s3://$STATIC_BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=3600' \
  --exclude "*" \
  --include "*/index.json" \
  --content-type "application/json" \
  ./gzip/ s3://$STATIC_BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=31104000' \
  --exclude "*" \
  --include "*.js" \
  --content-type "application/javascript" \
  ./gzip/ s3://$STATIC_BUCKET_NAME


echo $WEBSITE_URL
