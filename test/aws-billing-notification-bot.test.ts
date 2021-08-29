import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { AwsCostNotificationBotStack } from '../lib/aws-cost-notification-bot-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AwsCostNotificationBotStack(app, 'CostNotificationBotStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    "Resources": {}
  }, MatchStyle.EXACT))
});
