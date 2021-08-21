import { Canvas } from '@napi-rs/canvas';

export interface Item {
  key: string
  amount: number
}

export type ItemWithColor = Item & {
  color: string
}

export interface ReturnCanvasType {
  canvas: Canvas
  width: number
  height: number
}

export interface CancatCanvasType {
  canvas: Canvas
  width: number
  height: number
  position: "left" | "right" | "center"
}