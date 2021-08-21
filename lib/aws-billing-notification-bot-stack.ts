import { Rule, Schedule } from '@aws-cdk/aws-events'
import { Runtime } from '@aws-cdk/aws-lambda'
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs'
import * as cdk from '@aws-cdk/core'
import { Duration } from '@aws-cdk/core'
import { LambdaFunction } from '@aws-cdk/aws-events-targets'

const WEBHOOK_URL = process.env.WEBHOOK_URL!

export class AwsBillingNotificationBotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFn = new NodejsFunction(this, 'NotificationBot', {
      entry: 'src/lambda/app.ts',
      runtime: Runtime.NODEJS_14_X,
      memorySize: 256,
      timeout: Duration.seconds(30),
      bundling: {
        nodeModules: ["@napi-rs/canvas"],
        loader: {
          '.ttf': 'file',
        }
      },
      environment: {
        WEBHOOK_URL,
      },
    });

    const rule = new Rule(this, 'Schedule Rule', {
      schedule: Schedule.cron({ minute: '0', hour: '0' }),
     });

     rule.addTarget(new LambdaFunction(lambdaFn));
  }
}
