#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MyWeatherReportAppStack } from '../lib/my_weather_report_app-stack';

const app = new cdk.App();
new MyWeatherReportAppStack(app, 'MyWeatherReportAppStack');
