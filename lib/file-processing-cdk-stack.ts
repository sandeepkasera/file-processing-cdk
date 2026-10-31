import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';

export class FileProcessingCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'FileProcessingCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const filesBucket = new s3.Bucket(this, 'FilesBucket', {
      versioned: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    new cdk.CfnOutput(this, 'FilesBucketName', {
      value: filesBucket.bucketName,
    });

    const processorFunction = new lambda.Function(this, 'FileProcessor', {
      runtime: lambda.Runtime.NODEJS_22_X,

      handler: 'processor.handler',

      code: lambda.Code.fromAsset(
        path.join(__dirname, '../dist/lambda')
      ),

      memorySize: 128,

      timeout: cdk.Duration.seconds(10),
    });

    // Allow Lambda to read files from our S3 bucket
    filesBucket.grantRead(processorFunction);

    // Trigger Lambda whenever a new object is uploaded
    filesBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(processorFunction)
    );
  }
}