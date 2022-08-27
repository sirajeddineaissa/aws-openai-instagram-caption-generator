import { aws_secretsmanager, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dotenv from "dotenv";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";


dotenv.config();

interface InfrastructureStackProps extends StackProps {
  openApiSecretName : string
}

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
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
        OPENAI_API_SECRET_NAME: props.openApiSecretName,
        REGION : Stack.of(this).region
      },
    });

    // import secrt by refereence
    // secret should be in json format { "value" : <API_KEY> }
    const openApiSecret = aws_secretsmanager.Secret.fromSecretNameV2(this, "openapisecret",props.openApiSecretName)
    openApiSecret.grantRead(apiLambda)

    const gateway = new apiGateway.RestApi(this, "RestAPI", {
      restApiName: "IntagramCaptionGeneratorAPI"
    })

    const lambdaIntegration = new apiGateway.LambdaIntegration(apiLambda);
    gateway.root.addProxy({
      defaultIntegration: lambdaIntegration
    })

  }
}



