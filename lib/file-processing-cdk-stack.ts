import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

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
        path.join(__dirname, '../lambda')
      ),

      memorySize: 128,

      timeout: cdk.Duration.seconds(10),
    });
  }
}