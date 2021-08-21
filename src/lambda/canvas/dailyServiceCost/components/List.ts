import { createCanvas } from '@napi-rs/canvas'
import { ReturnCanvasType } from '../../shared/types'

type Args = {
  serviceNameList: string[]
  colorSchema: { [key: string]: string }
  isDevMode?: boolean
}

const lineHeight = 30
const margin = 25

export const List = (args: Args): ReturnCanvasType => {
  const canvasSize = {
    width: 1000,
    height: lineHeight * Math.ceil(args.serviceNameList.length / 2) + 2 * margin,
  }

  const canvas = createCanvas(canvasSize.width, canvasSize.height)
  const ctx = canvas.getContext('2d')

  const ServiceList = () => {
    const basePosition = {
      x: margin,
      y: margin,
    }
    const size = {
      width: canvasSize.width - 2 * margin,
      height: lineHeight * Math.ceil(args.serviceNameList.length / 2) - 2 * margin,
    }
    ctx.translate(basePosition.x, basePosition.y);
    if (args.isDevMode) {
      ctx.strokeRect(0, 0, size.width, size.height)
    }
    args.serviceNameList.forEach((name, i) => {
      const x = i % 2 ? size.width / 2 : 0
      const y = lineHeight * Math.floor(i / 2)
      ctx.fillStyle = `${args.colorSchema[name]}`;
      ctx.fillRect(x, y + (lineHeight - 15) / 2, 15, 15)
      ctx.font = `16px NotoSans`
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#000"
      ctx.fillText(name, x + 23, y + (lineHeight / 2))

      if (args.isDevMode) {
        ctx.strokeRect(x, y, size.width / 2, lineHeight)
      }
    })
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  ServiceList()

  return {
    canvas: canvas,
    width: canvasSize.width,
    height: canvasSize.height,
  }
}