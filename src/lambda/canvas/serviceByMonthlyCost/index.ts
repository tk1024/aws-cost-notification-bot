import { GlobalFonts } from '@napi-rs/canvas'
import { colors } from "../shared/colors"
import { Circle } from "./components/Circle"
import { List } from './components/List'
import { cancatCanvas } from '../shared/concatCancas'
// @ts-ignore
import ttf from "../shared/NotoSans-Regular.ttf"
import { Item, ItemWithColor } from '../shared/types'
GlobalFonts.registerFromPath(ttf, "NotoSans")

type Args = {
  data: Item[]
}

const isDevMode: boolean = false

export const serviceByMonthlyCost = async (args: Args) => {

  const ItemList: ItemWithColor[] = args.data.map((d, i) => ({
    ...d,
    color: colors[i % colors.length],
  }))

  const circleCanvas = Circle({
    data: ItemList,
    isDevMode,
  })

  const listCanvas = List({
    data: ItemList,
    isDevMode,
  })

  const canvas = cancatCanvas([
    { position: "center", ...circleCanvas },
    { position: "left", ...listCanvas },
  ])

  return canvas.toBuffer("image/png")
}