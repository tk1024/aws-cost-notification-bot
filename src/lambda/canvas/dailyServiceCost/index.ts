import { GlobalFonts } from '@napi-rs/canvas'
import { CostExplorer } from 'aws-sdk'
import { colors } from '../shared/colors'
import { cancatCanvas } from '../shared/concatCancas'
// @ts-ignore
import ttf from "../shared/NotoSans-Regular.ttf"
import { Chart } from './components/Chart'
import { List } from './components/List'
GlobalFonts.registerFromPath(ttf, "NotoSans")

type Args = {
  data: CostExplorer.GetCostAndUsageResponse
}

const isDevMode: boolean = false

export const dailyServiceCost = async (args: Args) => {
  const data = (args.data.ResultsByTime || []).map(d => ({
    date: d.TimePeriod!.Start,
    group: (d.Groups || []).map(g => ({
      key: (g.Keys || []).join(","),
      amount: Number(g.Metrics?.BlendedCost.Amount) || 0,
    }))
  }))

  const uniqServiceNames = Array.from(new Set(data.map(d => d.group.map(g => g.key)).flat(1)))

  const genColorSchema = (serviceNames: string[]) => {
    const r: { [key: string]: string } = {}
    serviceNames.forEach((name, i) => {
      r[name] = colors[i % colors.length]
    })
    return r
  }

  const chart = Chart({
    data,
    colorSchema: genColorSchema(uniqServiceNames),
    isDevMode,
  })

  const list = List({
    serviceNameList: uniqServiceNames,
    colorSchema: genColorSchema(uniqServiceNames),
    isDevMode,
  })

  const canvas = cancatCanvas([
    { position: "center", ...chart },
    { position: "center", ...list },
  ])

  return canvas.toBuffer("image/png")
}