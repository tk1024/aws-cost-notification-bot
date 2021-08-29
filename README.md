# aws-cost-notification-bot

discordにAWSのコストを毎日投稿するBOTです。  
AWS CDKを利用してLambdaから世界標準時0時に以下のような画像が投稿されます。


<img width="474" alt="スクリーンショット 2021-08-30 0 21 26" src="https://user-images.githubusercontent.com/5736661/131255795-84bc4b0c-dbad-48d4-9c39-2818b4cec8ae.png">

# 利用方法

※ CDKコマンドが利用できる必要があります(参考: https://docs.aws.amazon.com/cdk/latest/guide/cli.html)


```
cdk bootstrap
WEBHOOK_URL=[YOUR_DISCORD_WEDHOOK_URL] cdk deploy
```
