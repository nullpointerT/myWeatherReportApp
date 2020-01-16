import * as cdk from '@aws-cdk/core';
import lambda = require('@aws-cdk/aws-lambda');
import { Duration } from '@aws-cdk/core';
import iam = require('@aws-cdk/aws-iam');
import cwe = require('@aws-cdk/aws-events');
import targets = require('@aws-cdk/aws-events-targets');

export class MyWeatherReportAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define the location of the code
    const lambdaCode = lambda.Code.fromAsset("./lambda/func.zip");

    //create a lambda function

    const myWeatherAppLambda = new lambda.Function(this, "myWeatherAppLambda",{
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambdaCode,
      handler: 'index.handler', // file is "index", function is "handler"
      timeout: Duration.seconds(30)
    });

    //add permission
    const statement = new iam.PolicyStatement();
    statement.addActions("lambda:InvokeFunction");
    statement.addResources("*");
    statement.addActions("sns:*");
    myWeatherAppLambda.addToRolePolicy(statement);

    //add CW events trigger

    const rule = new cwe.Rule(this, "Schedule", {
      schedule: cwe.Schedule.expression('cron(0 16 * * ? *)'), // https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html
      enabled: true
    });

    //add lambda as cw event target

    rule.addTarget(new targets.LambdaFunction(myWeatherAppLambda));
  }
}
