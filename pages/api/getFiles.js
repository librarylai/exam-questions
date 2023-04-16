import * as gcsStorage from '@google-cloud/storage'
import path from 'path'
// Creates a client using Application Default Credentials
const storage = new gcsStorage.Storage({
  keyFilename: path.join(__dirname, `../../../../gcs-keyfile.json`),
})
const bucketName = process.env.GCS_BUCKET_NAME
const bucket = storage.bucket(bucketName)
const BASE_URL = 'https://storage.googleapis.com'
const handler = async (req, res) => {
  let [files] = await bucket.getFiles()
  const fileImages = files.map((file) => `${BASE_URL}/${file.bucket.id}/${file.id}`)
  return res.status(200).json({ images: fileImages })
}

export default handler
