import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dotenv from "dotenv"
export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const layer = new lambda.LayerVersion(this, "LambdaLayer", {
      code: lambda.Code.fromAsset("lambda/lambda_layer.zip"),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_9],
    });

    const lambdaAPI = new lambda.Function(this, "ApiFunction", {
      runtime: lambda.Runtime.PYTHON_3_9,
      code: lambda.Code.fromAsset("../app/"), // Code directory
      handler: "api.handler", // Handler to wrap the API 
      layers: [layer],
      environment: {
        "OPENAI_API_KEY": process.env.OPENAI_API_KEY ?? ""
      }
    })

  }
}

