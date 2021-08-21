import { createCanvas, Image } from "@napi-rs/canvas"
import { CancatCanvasType } from "./types"

interface Options {
  margin: number
  gap: number
}

const defaultOptions: Options = {
  margin: 30,
  gap: 30,
}

const calcStartXPostion = (fullWidth: number, canvas: CancatCanvasType): number => {
  switch (canvas.position) {
    case "left":
      return 0
    case "right":
      return fullWidth - canvas.width
    case "center":
      return (fullWidth - canvas.width) / 2
  }
}

export const cancatCanvas = (canvasList: CancatCanvasType[], inputOptions?: Partial<Options>) => {
  const options: Options = {
    ...defaultOptions,
    ...inputOptions,
  }

  const width = Math.max(...canvasList.map(c => c.width)) + 2 * options.margin
  const height = canvasList.map(c => c.height).reduce((a, c) => a + c, 0) + (canvasList.length - 1) * options.gap + 2 * options.margin

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // backgroundColor
  ctx.fillStyle = "#fff"
  ctx.fillRect(0, 0, width, height)

  canvasList.reduce((startYPosition, canvas) => {
    const startXPostion = calcStartXPostion(width - 2 * options.margin, canvas) + options.margin
    const i = new Image()
    i.src = canvas.canvas.toBuffer("image/png")
    ctx.drawImage(i, startXPostion, startYPosition)

    return startYPosition + canvas.height + options.gap
  }, options.margin)

  return canvas
}