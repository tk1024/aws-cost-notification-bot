import { createCanvas } from '@napi-rs/canvas'
import { ItemWithColor, ReturnCanvasType } from '../../shared/types'

type Args = {
  data: ItemWithColor[]
  isDevMode?: boolean
}

export const List = (args: Args): ReturnCanvasType => {
  const fontSize = 30
  const lineHeight = 75
  const boxSize = 30
  const canvasSize = {
    width: 1000,
    height: (args.data.length + 1) * lineHeight
  }
  const canvas = createCanvas(canvasSize.width, canvasSize.height)
  const ctx = canvas.getContext('2d')

  ctx.font = `${fontSize}px NotoSans`
  ctx.fillStyle = "black"

  const total: ItemWithColor = {
    key: "Total",
    amount: args.data.map(d => d.amount).reduce((a, c) => a + c, 0),
    color: "transparent",
  };

  [...args.data, total].map((d, i, all) => {
    const boxPosition = {
      x: 0, y: i * lineHeight, width: canvasSize.width, height: lineHeight,
    }

    // 補助線
    if (args.isDevMode) {
      ctx.strokeStyle = "red"
      ctx.beginPath();
      ctx.rect(boxPosition.x, boxPosition.y, boxPosition.width, boxPosition.height);
      ctx.stroke();
    }

    if (i < all.length - 1) {
      ctx.strokeStyle = "rgba(240,240,240,1)"
      ctx.beginPath();
      ctx.moveTo(boxPosition.x, boxPosition.y + boxPosition.height);
      ctx.lineTo(boxPosition.x + boxPosition.width, boxPosition.y + boxPosition.height);
      ctx.closePath();
      ctx.stroke();
    }

    // filled square
    if (d.color) {
      ctx.fillStyle = d.color
      ctx.fillRect(boxPosition.x, boxPosition.y + boxPosition.height / 2 - boxSize / 2, boxSize, boxSize)
    }

    // service name
    ctx.fillStyle = "black"
    ctx.fillText(d.key, boxPosition.x + boxSize + 15, boxPosition.y + boxPosition.height / 2 + fontSize / 2 - 5)

    // price
    ctx.fillStyle = "black"
    const text = `$${d.amount.toFixed(2)}`
    const measureTextWidth = ctx.measureText(text).width
    ctx.fillText(text, boxPosition.x + boxPosition.width - measureTextWidth, boxPosition.y + boxPosition.height / 2 + fontSize / 2 - 5)
  })

  return {
    canvas,
    width: canvasSize.width,
    height: canvasSize.height,
  }
}