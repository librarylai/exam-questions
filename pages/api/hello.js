// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
import formidable from 'formidable' // 用來處理 FormData
import * as gcsStorage from '@google-cloud/storage'
// Creates a client using Application Default Credentials
const storage = new gcsStorage.Storage()
const bucketName = process.env.GCS_BUCKET_NAME
const bucket = storage.bucket(bucketName)
console.log('bucket', bucket)
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
        console.log('GCSFILE:', file)
        if (err) {
          console.error(`Error uploading image image_to_upload.jpeg: ${err}`)
        } else {
          console.log(`Image image_to_upload.jpeg uploaded to ${bucketName}.`)
          // 設定檔案為公開
          file.makePublic().then(() => {
            let fileGCSUrl = getUrl(`${file.name}`)
            console.log('fileGCSUrl：', fileGCSUrl)
            return res.status(200).json({ file: fileGCSUrl })
          })
        }
      }
    )
  })
}
export default handler
