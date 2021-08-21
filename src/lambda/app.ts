
import { dailyServiceCost } from "./canvas/dailyServiceCost";
import { serviceByMonthlyCost } from "./canvas/serviceByMonthlyCost";
import { fetchDailyConst, fetchMonthlyConst } from "./libs/fetchAWSCost";
import { postImage } from './libs/postImage';

export const handler = async () => {
  if (!process.env.WEBHOOK_URL) {
    throw Error("WEBHOOK_URL required")
  }

  const images = await Promise.all([
    serviceByMonthlyCost({
      data: await fetchMonthlyConst(),
    }),
    dailyServiceCost({
      data: await fetchDailyConst(),
    })
  ])

  for (const image of images) {
    await postImage(process.env.WEBHOOK_URL, image)
  }
}