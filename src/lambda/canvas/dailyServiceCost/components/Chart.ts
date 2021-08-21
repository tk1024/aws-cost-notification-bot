import { createCanvas } from '@napi-rs/canvas'
import { ReturnCanvasType } from '../../shared/types'

type Args = {
  data: {
    date: string
    group: {
      key: string
      amount: number
    }[]
  }[]
  colorSchema: { [key: string]: string }
  isDevMode?: boolean
}

const margin = 25

const canvasSize = {
  width: 1000,
  height: 500,
}

export const Chart = (args: Args): ReturnCanvasType => {
  const canvas = createCanvas(canvasSize.width, canvasSize.height)
  const ctx = canvas.getContext('2d')

  const chartWidth = canvasSize.width - 100
  const interval = chartWidth / args.data.length

  const maxDailyValueInRange = () => {
    return Math.max(...args.data.map(d => d.group.reduce((a, g) => a + g.amount, 0)))
  }

  const maxDailyValue = Math.ceil(maxDailyValueInRange())

  const MainChart = () => {
    const basePosition = {
      x: 75,
      y: margin,
    }
    const size = {
      lineWidth: 8,
      height: canvasSize.height - 2 * margin,
    }
    ctx.translate(basePosition.x, basePosition.y);
    args.data.map((d, i) => {
      const startPositionX = i * interval

      if (args.isDevMode) {
        ctx.strokeRect(startPositionX, 0, interval, size.height)
      }
      d.group.reduce((startYPosition, g) => {
        const height = g.amount / maxDailyValue * size.height

        ctx.fillStyle = args.colorSchema[g.key];
        ctx.fillRect(startPositionX + (interval - size.lineWidth) / 2, startYPosition - height, size.lineWidth, height)
        return startYPosition - height
      }, size.height)
    })
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  const XAxis = () => {
    const basePosition = {
      x: 75,
      y: canvasSize.height,
    }
    ctx.translate(basePosition.x, basePosition.y);
    ctx.fillStyle = "#000"
    ctx.font = `14px NotoSans`
    args.data.map((d, i) => {
      const text = d.date.replace(/[\d]{4}-[\d]{2}-/, "")
      const startPositionX = i * interval
      const textWidth = ctx.measureText(text).width
      ctx.fillText(text, startPositionX + (interval - textWidth) / 2, 0)
    })
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  const YAxis = () => {
    const basePosition = {
      x: margin,
      y: margin,
    }
    const size = {
      width: 50,
      height: canvasSize.height - 2 * margin
    }
    const divisionNumber = 4
    ctx.strokeStyle = "#000"
    ctx.textBaseline = "middle"
    ctx.font = `20px NotoSans`
    ctx.translate(basePosition.x, basePosition.y);
    if (args.isDevMode) {
      ctx.strokeRect(0, 0, size.width, size.height);
    }
    Array(divisionNumber).fill(0).map((_, i) => divisionNumber - i).forEach((v, i) => {
      const text = `$${(maxDailyValue / divisionNumber * v).toFixed(1)}`
      ctx.fillText(text, 0, (size.height / divisionNumber) * i)
    })
    ctx.fillText("0", 0, size.height)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  const Scale = () => {
    const basePosition = {
      x: 75,
      y: margin,
    }
    const size = {
      width: interval * 30,
      height: canvasSize.height - 2 * margin
    }
    const divisionNumber = 4
    ctx.strokeStyle = "#ddd"
    ctx.translate(basePosition.x, basePosition.y);
    ctx.strokeRect(0, 0, size.width, size.height)
    Array(divisionNumber).fill(0).forEach((v, i) => {
      const y = i * (size.height / divisionNumber)
      ctx.beginPath();
      ctx.moveTo(0, y)
      ctx.lineTo(interval * 30, y)
      ctx.stroke()
    })
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  Scale()
  MainChart()
  XAxis()
  YAxis()

  return {
    canvas: canvas,
    width: canvasSize.width,
    height: canvasSize.height,
  }
}