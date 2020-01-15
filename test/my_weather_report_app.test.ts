import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import MyWeatherReportApp = require('../lib/my_weather_report_app-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new MyWeatherReportApp.MyWeatherReportAppStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
