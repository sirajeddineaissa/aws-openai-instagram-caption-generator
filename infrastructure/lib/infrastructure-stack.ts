import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from '@aws-cdk/aws-lambda-python-alpha';
import * as dotenv from "dotenv"
import { Runtime } from 'aws-cdk-lib/aws-lambda';

dotenv.config();
export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const layer = new lambda.PythonLayerVersion(this, "LambdaLayer", {
      entry: "/lambda/lambda_layer.zip",
      compatibleRuntimes: [Runtime.PYTHON_3_9],
    });

    const lambdaAPI = new lambda.PythonFunction(this, "ApiFunction", {
      runtime: Runtime.PYTHON_3_9,
      entry: "../app/", // Code directory
      handler: "api.handler", // Handler to wrap the API 
      layers: [layer],
      environment: {
        "OPENAI_API_KEY": process.env.OPENAI_API_KEY ?? ""
      }
    })

  }
}

