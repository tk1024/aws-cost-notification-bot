import { CostExplorer } from 'aws-sdk'

const ce = new CostExplorer({ region: 'us-east-1' });

class ExDate extends Date {
  format() {
    return this.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  }
}

export const fetchMonthlyConst = async () => {
  const now = new ExDate();

  const result = await ce.getCostAndUsage({
    TimePeriod: {
      End: new ExDate(now.getFullYear(), now.getMonth() + 1, 0, 0, 0, 0).format(),
      Start: new ExDate(now.getFullYear(), now.getMonth(), 1, 0, 0, 0).format(),
    },
    Granularity: "MONTHLY",
    GroupBy: [{ Key: 'SERVICE', Type: 'DIMENSION' }],
    Metrics: ['BlendedCost'],
  }).promise()

  return result.ResultsByTime![0].Groups!.map(g => ({
    key: g.Keys![0],
    amount: Number(g.Metrics!.BlendedCost.Amount),
    unit: g.Metrics!.BlendedCost.Unit,
  })).sort((a, b) => b.amount - a.amount)
}

export const fetchDailyConst = async () => {
  const now = new ExDate();

  const result = await ce.getCostAndUsage({
    TimePeriod: {
      End: new ExDate(now.getFullYear(), now.getMonth() + 1, 0, 0, 0, 0).format(),
      Start: new ExDate(now.getFullYear(), now.getMonth(), 1, 0, 0, 0).format(),
    },
    Granularity: "DAILY",
    GroupBy: [{ Key: 'SERVICE', Type: 'DIMENSION' }],
    Metrics: ['BlendedCost'],
  }).promise()

  return result
}