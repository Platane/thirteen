#!/bin/bash

set -e


export STACKNAME=${STACKNAME:-'thirteen-bot'}
export TEMP_BUCKET_NAME="dunelm-template-adsiasdiias123"


# build bot
yarn build

# package app + deploy
aws cloudformation package \
  --template-file template.yml \
  --s3-bucket $TEMP_BUCKET_NAME \
  --output-template-file .build/packaged-template.yml

aws cloudformation deploy \
  --no-fail-on-empty-changeset \
  --template-file .build/packaged-template.yml \
  --stack-name $STACKNAME \
  --capabilities CAPABILITY_IAM


export APP_ORIGIN=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`websiteUrl\`].OutputValue' --output text`

export STATIC_BUCKET_NAME=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`staticAssetBucket\`].OutputValue' --output text`

# build and deploy the website static asssets
( cd ../website ; yarn build )
../website-builder/script/aws-cp.sh $STATIC_BUCKET_NAME ../website/.build

# build bot
yarn build

# package app + deploy
aws cloudformation package \
  --template-file template.yml \
  --s3-bucket $TEMP_BUCKET_NAME \
  --output-template-file .build/packaged-template.yml

aws cloudformation deploy \
  --no-fail-on-empty-changeset \
  --template-file .build/packaged-template.yml \
  --stack-name $STACKNAME \
  --capabilities CAPABILITY_IAM

