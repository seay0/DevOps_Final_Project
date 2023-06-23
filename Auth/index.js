const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
//Test Git Action

// DynamoDB에서 사용자 정보를 찾는 함수
async function findUser(email, password) {
  const params = {
    TableName: 'Dynamo_user',
    Key: {
      email: email,
      password: password,
    },
  };

  return ddb.get(params).promise();
}

exports.handler = async (event) => {
  try {
    const email = event.email;
    const password = event.password;

    // Find the user with the given email and password in the DynamoDB table
    const data = await findUser(email, password);

    // Check if user data is returned
    if (!data.Item) {
      // User not found
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    } else {
      // User found, login successful
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          // 'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ message: 'Login successful' }),
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


