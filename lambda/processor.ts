export async function handler(event: unknown) {
  console.log('Lambda function executed!');
  console.log('Received event:', JSON.stringify(event));

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'File processor is running!',
    }),
  };
}
