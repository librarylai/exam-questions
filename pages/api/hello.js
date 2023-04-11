// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs'
import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = async (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(500).json({ error: '解析 FormData 数据失败' })
    }
    const mimetype = file?.files?.mimetype
    // 未來用 GCP 或 AWS 來存檔
    fs.readFile(file.files.filepath, (err, data) => {
      if (err) {
        return res.status(500).json({ error: '讀取文件失敗' })
      }
      // 将文件内容转换为 base64
      const base64Data = data.toString('base64')
      // 在这里可以对 base64Data 进行处理，例如保存到数据库或进行其他业务逻辑处理
      return res.status(200).json({ file: `data:${mimetype};base64,${base64Data}` })
    })
  })
}
export default handler
