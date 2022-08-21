import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dotenv from "dotenv";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";

dotenv.config();

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const layer = new lambda.LayerVersion(this, "BaseLayer", {
      code: lambda.Code.fromAsset("lambda/lambda_layer.zip"),
      compatibleRuntimes: [lambda.Runtime.PYTHON_3_7],
    });

    const apiLambda = new lambda.Function(this, "ApiFunction", {
      runtime: lambda.Runtime.PYTHON_3_7,
      code: lambda.Code.fromAsset("../app/"),
      handler: "api.handler",
      layers: [layer],
      environment: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
      },
    });

    const gateway = new apiGateway.RestApi(this, "RestAPI", {
      restApiName: "IntagramCaptionGeneratorAPI"
    })

    const lambdaIntegration = new apiGateway.LambdaIntegration(apiLambda);
    gateway.root.addProxy({
      defaultIntegration: lambdaIntegration
    })

  }
}



