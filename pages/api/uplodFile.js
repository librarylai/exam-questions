// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
import formidable from 'formidable' // 用來處理 FormData
import * as gcsStorage from '@google-cloud/storage'
import path from 'path'
// Creates a client using Application Default Credentials
const storage = new gcsStorage.Storage({
  keyFilename: path.join(__dirname, `../../../../gcs-keyfile.json`),
})
const bucketName = process.env.GCS_BUCKET_NAME
const bucket = storage.bucket(bucketName)
export const config = {
  api: {
    bodyParser: false, // 用來處理 FormData
  },
}
function getUrl(fileName) {
  return bucket.file(fileName).publicUrl()
}
const handler = async (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(500).json({ error: '解析 FormData 数据失败' })
    }
    const filePath = file?.files?.filepath
    const mimetype = file?.files?.mimetype
    const originalFileName = file?.files?.originalFilename
    bucket.upload(
      `${filePath}`,
      {
        metadata: {
          originalname: originalFileName,
          contentType: mimetype,
        },
      },
      function (err, file) {
        if (err) {
          console.error(`Error uploading image image_to_upload.jpeg: ${err}`)
        } else {
          console.log(`Image image_to_upload.jpeg uploaded to ${bucketName}.`)
          // 設定檔案為公開
          file
            .makePublic()
            .then(() => {
              let fileGCSPublicUrl = getUrl(`${file.name}`)
              console.log('fileGCSPublicUrl', fileGCSPublicUrl)
              return res.status(200).json({ publicUrl: fileGCSPublicUrl })
            })
            .catch((err) => console.log('err', err))
        }
      }
    )
  })
}
export default handler
