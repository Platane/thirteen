#!/bin/sh

set -e

export STACKNAME="thirteen-bot"

yarn build

# package app + deploy
aws cloudformation package \
  --template-file ./infrastructure/template.yml \
  --s3-bucket dunelm-template-adsiasdiias123 \
  --output-template-file .build/packaged-template.yml

aws cloudformation deploy \
  --template-file .build/packaged-template.yml \
  --stack-name $STACKNAME \
  --capabilities CAPABILITY_IAM
