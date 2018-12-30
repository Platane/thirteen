#!/bin/bash

set -e

rm -rf .build
mkdir .build

export SHA=`echo ${CIRCLE_SHA1:-'hello'} | cut -c 1-7`
export STACKNAME="thirteen-website-$SHA"
export DOMAIN="yellow-sail-lab.de"
export SUBDOMAIN="$SHA.website-thirteen"

export TEMP_BUCKET_NAME="dunelm-template-adsiasdiias123"

# package app + deploy
aws cloudformation package \
  --template-file template.yml \
  --s3-bucket dunelm-template-adsiasdiias123 \
  --output-template-file .build/packaged-template.yml

aws cloudformation deploy \
  --no-fail-on-empty-changeset \
  --parameter-overrides \
    Domain=$DOMAIN \
    SubDomain=$SUBDOMAIN \
  --tags \
    COMMIT_SHA1=$CIRCLE_SHA1 \
    BRANCH=$CIRCLE_BRANCH \
    BUILD_NUM=$CIRCLE_BUILD_NUM \
    APP="thirteen-website" \
  --template-file .build/packaged-template.yml \
  --stack-name $STACKNAME \
  --capabilities CAPABILITY_IAM

rm -rf public
mkdir public

# build the api static
( cd ../api-static ; yarn build )
cp -r ../api-static/.build public/data

# build the website static asssets
( cd ../website ; yarn build )
cp -r ../website/.build/* public/

# build the pages
export APP_BASENAME="/"
export APP_ORIGIN=`aws cloudformation describe-stacks \
--stack-name $STACKNAME \
--query 'Stacks[0].Outputs[?OutputKey==\`websiteUrl\`].OutputValue' \
--output text`
( cd ../website-builder ; yarn build )
cp -r ../website-builder/.build/* public/

# deploy
export STATIC_BUCKET_NAME=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`staticAssetBucket\`].OutputValue' --output text`

./script/aws-cp.sh $STATIC_BUCKET_NAME public

echo $APP_ORIGIN
