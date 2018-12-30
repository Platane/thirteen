#!/bin/bash

set -e


export SHA=`echo ${CIRCLE_SHA1:-'hello'} | cut -c 1-7`
export STACKNAME="thirteen-bot-$SHA"
export DOMAIN="yellow-sail-lab.de"
export SUBDOMAIN="$SHA.bot-thirteen"

export TEMP_BUCKET_NAME="dunelm-template-adsiasdiias123"

# build the website static asssets
( cd ../website ; yarn build )

# build bot
( cd ../bot ; yarn build )

# package app + deploy
aws cloudformation package \
  --template-file template.yml \
  --s3-bucket $TEMP_BUCKET_NAME \
  --output-template-file .build/packaged-template.yml

aws cloudformation deploy \
  --parameter-overrides \
      Domain=$DOMAIN \
      SubDomain=$SUBDOMAIN \
      githubAppId=$GITHUB_APP_ID \
      githubAppPrivateKey="$GITHUB_APP_PRIVATE_KEY" \
      browserStackUser=$BROWSER_STACK_USER \
      browserStackKey=$BROWSER_STACK_KEY \
  --tags \
    COMMIT_SHA1=${CIRCLE_SHA1:-'-'} \
    BRANCH=${CIRCLE_BRANCH:-'-'} \
    BUILD_NUM=${CIRCLE_BUILD_NUM:-'-'} \
    APP="thirteen-bot" \
  --no-fail-on-empty-changeset \
  --template-file .build/packaged-template.yml \
  --stack-name $STACKNAME \
  --capabilities CAPABILITY_IAM


export STATIC_BUCKET_NAME=`aws cloudformation describe-stacks --stack-name $STACKNAME \
  --query 'Stacks[0].Outputs[?OutputKey==\`staticAssetBucket\`].OutputValue' --output text`

# deploy the website static asssets
../website-builder/script/aws-cp.sh $STATIC_BUCKET_NAME ../website/.build


