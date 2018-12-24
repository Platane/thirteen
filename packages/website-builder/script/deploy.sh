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

export APP_ORIGIN=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`websiteUrl\`].OutputValue' --output text`

export STATIC_ENDPOINT="$S3_URL/data"


# build and deploy the api static
( cd ../api-static ; yarn build )
rm -rf ../api-static/public
mkdir ../api-static/public
mv ../api-static/.build ../api-static/public/data
./script/aws-cp.sh $STATIC_BUCKET_NAME ../api-static/public

# build and deploy the website static asssets
( cd ../website ; yarn build )
./script/aws-cp.sh $STATIC_BUCKET_NAME ../website/.build

# build and deploy the pages
( cd ../website-builder ; yarn build )
./script/aws-cp.sh $STATIC_BUCKET_NAME ../website-builder/.build


echo $APP_ORIGIN
