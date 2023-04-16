import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import React from 'react'
const API_URL = `/api/uploadFile`
const Editor = ({ value, onChange, ...props }) => {
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData()
          loader.file.then((file) => {
            body.append('files', file)
            fetch(API_URL, {
              method: 'post',
              body: body,
            })
              .then((res) => res.json())
              .then((res) => {
                console.log('res', res)
                resolve({
                  default: res?.publicUrl,
                })
              })
              .catch((err) => {
                reject(err)
              })
          })
        })
      },
    }
  }
  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader)
    }
  }
  return (
    <CKEditor
      config={{
        extraPlugins: [uploadPlugin],
      }}
      editor={ClassicEditor}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData()
        onChange(data)
      }}
      {...props}
    />
  )
}

export default Editor
