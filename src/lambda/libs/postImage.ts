import axios from 'axios'
const FormData = require("form-data")

const postImageToDiscord = async (url: string, image: Buffer) => {
  const form = new FormData()
  form.append("file", image, {
    filename: `aws-cost ${(new Date()).toISOString()}.png`,
    contentType: 'image/png',
  })
  await axios.post(url, form, {
    headers: form.getHeaders()
  })
}

export const postImage = async (url: string, image: Buffer) => {
  if (/discord\.com\/api\/webhooks/.test(url)) {
    return postImageToDiscord(url, image)
  }

  throw Error("Unsupported service url")
}