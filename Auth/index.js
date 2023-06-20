
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

function recordTestResult(email, password) {
  return ddb.put({
    TableName: 'Dynamo_user',
    Item: {
      email: email,
      password: password,
      timestamp: new Date().toISOString(),
    },
  }).promise();
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

exports.handler = async (event) => {
  // Hardcoded email and password values for demonstration purposes
  const users = [
    { email: 'mase306@naver.com', password: 'zerobase0000!' },
    { email: 'codestates@devops.com', password: 'dob4' },
  ];

  try {
    const email = event.email;
    const password = event.password;

    // Find the user with the given email in the users array
    const user = users.find((u) => u.email === email);

    if (!user) {
      // User not found
      return {
        statusCode: 404,
        body: 'User not found',
      };
    }

    if (user.password === password) {
      // Passwords match, login successful
      
      // Record the result to DynamoDB
      await recordTestResult(email, password);
      
      return {
        statusCode: 200,
        body: 'Login successful',
      };
    } else {
      // Passwords do not match, login failed
      return {
        statusCode: 401,
        body: 'Login failed',
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: 'Error occurred',
    };
  }
};
