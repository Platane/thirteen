import S3 from 'aws-sdk/clients/s3'
// import AWS from 'aws-sdk/global'
import * as config from '../../config'

// AWS.config.update(config.aws)

export const upload = async (key, body, options = {}) => {
  const s3 = new S3(config.aws)

  const data = await s3
    .upload({
      Bucket: config.BUCKET_NAME,
      Key: key,
      Body: body,
      ACL: 'public-read',
      ...options,
    })
    .promise()

  return data.Location
}
