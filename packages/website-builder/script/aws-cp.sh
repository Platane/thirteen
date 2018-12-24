#!/bin/bash

set -e

export BUCKET_NAME=$1
export DIR=$2

echo "deploy   $DIR   to   $BUCKET_NAME"

rm -rf $DIR/.tmp-gzip

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --cache-control 'max-age=31104000' \
  --exclude "*.html" \
  --exclude "*.json" \
  --exclude "*.css" \
  --exclude "*.js" \
  $DIR s3://$BUCKET_NAME

rm -rf $DIR/.tmp-gzip
mkdir $DIR/.tmp-gzip

for file in `find $DIR -name "*.html" -type f -or -name "*.json" -type f -or -name "*.css" -type f -or -name "*.js" -type f`; do

  dist=$(realpath --relative-to=$DIR $file)

  dest=`echo "$DIR/.tmp-gzip/$dist"`

  mkdir -p $(dirname $dest)

  gzip -9 -c $file > $dest
done

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=3600' \
  --exclude "*" \
  --include "*.html" \
  --content-type "text/html" \
  $DIR/.tmp-gzip/ s3://$BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=31104000' \
  --exclude "*" \
  --include "*.css" \
  --content-type "text/css" \
  $DIR/.tmp-gzip/ s3://$BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=31104000' \
  --exclude "*" \
  --include "*.json" \
  --exclude "*/index.json" \
  --content-type "application/json" \
  $DIR/.tmp-gzip/ s3://$BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=3600' \
  --exclude "*" \
  --include "*/index.json" \
  --content-type "application/json" \
  $DIR/.tmp-gzip/ s3://$BUCKET_NAME

aws s3 cp --no-progress --recursive \
  --acl "public-read" \
  --content-encoding "gzip" \
  --cache-control 'max-age=31104000' \
  --exclude "*" \
  --include "*.js" \
  --content-type "application/javascript" \
  $DIR/.tmp-gzip/ s3://$BUCKET_NAME


