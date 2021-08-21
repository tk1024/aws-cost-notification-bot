import { createCanvas } from '@napi-rs/canvas'
import { ItemWithColor, ReturnCanvasType } from '../../shared/types'

type Args = {
  data: ItemWithColor[]
  isDevMode?: boolean
}

export const Circle = (args: Args): ReturnCanvasType => {
  const canvasSize = {
    width: 500,
    height: 500
  }
  const canvas = createCanvas(canvasSize.width, canvasSize.height)
  const ctx = canvas.getContext('2d')

  if (args.isDevMode) {
    // background color
    ctx.fillStyle = "rgba(128,128,128,1)"
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)
  }

  const totalAmount = args.data.map(d => d.amount).reduce((a, c) => a + c, 0)

  // each services
  args.data.map((d, i) => {
    const startAngel = (args.data.slice(0, i).map(d => d.amount).reduce((a, c) => a + c, 0) / totalAmount) * 360
    const angel = (d.amount / totalAmount) * 360
    const endAngel = startAngel + angel

    ctx.strokeStyle = d.color
    ctx.lineWidth = 60

    ctx.beginPath();
    ctx.arc(canvasSize.width / 2, canvasSize.height / 2, 220, (-90 + startAngel) / 180 * Math.PI, (-90 + endAngel) / 180 * Math.PI)
    ctx.stroke()
  })

  // total
  ctx.font = `80px NotoSans`
  ctx.fillStyle = "black"
  ctx.textAlign = "left"
  const text = `$${totalAmount.toFixed(2)}`
  ctx.fillText(text, canvasSize.width / 2 - ctx.measureText(text).width / 2, canvasSize.width / 2 + 25)

  return {
    canvas,
    width: canvasSize.width,
    height: canvasSize.height,
  }
}