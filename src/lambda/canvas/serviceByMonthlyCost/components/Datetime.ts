import { createCanvas } from '@napi-rs/canvas'
import { ReturnCanvasType } from '../../shared/types'

type Args = {
  isDevMode?: boolean
  textAlign: "left" | "center" | "right"
}

export const DateTime = (args: Args): ReturnCanvasType => {
  const fontSize = 48
  const canvasSize = {
    width: 600,
    height: 60,
  }
  const canvas = createCanvas(canvasSize.width, canvasSize.height)
  const ctx = canvas.getContext('2d')

  if (args.isDevMode) {
    ctx.strokeStyle = "pink"
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
  }

  ctx.font = `${fontSize}px NotoSans`
  ctx.fillStyle = "#aaa"
  ctx.textAlign = "left"
  ctx.textBaseline = "middle"

  // YYYY-MM-DD HH:ii:ss
  const date = new Date()
  const text = `${date.toISOString().replace(/T|Z/g, " ").replace(/\.\d{3}/, "")}`

  switch (args.textAlign) {
    case "left":
      ctx.fillText(text, 0, canvasSize.height / 2)
      break;
    case "center":
      ctx.fillText(text, (canvasSize.width - ctx.measureText(text).width) / 2, canvasSize.height / 2)
      break
    case "right":
      ctx.fillText(text, canvasSize.width - ctx.measureText(text).width, canvasSize.height / 2)
      break;
  }

  return {
    canvas,
    width: canvasSize.width,
    height: canvasSize.height,
  }
}