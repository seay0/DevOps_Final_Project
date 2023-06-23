var aws = require("aws-sdk");
var ses = new aws.SES({ region: "ap-northeast-2" });
var dynamodb = new aws.DynamoDB({ region: "ap-northeast-2" });
//Test Git Action

exports.handler = async function (event) {
  var params = {
    TableName: "Dynamo_Log", // 테이블 이름을 여기에 입력하세요
  };

  var data = await dynamodb.scan(params).promise();

  // 모든 항목을 스캔한 후에 JavaScript 배열의 sort 함수를 사용하여 최신 항목을 찾습니다.
  var sortedItems = data.Items.sort(function(a, b) {
    return new Date(b.Timestamp.S) - new Date(a.Timestamp.S);
  });

  var textBody = "";
  if (sortedItems.length > 0) {
    var item = sortedItems[0];
    textBody += `Timestamp: ${item.Timestamp.S}\nLogType: ${item.LogType.S}\nLogContent: ${item.Logcontent.S}\n\n`;
  }

  var subject = "DynamoDB Table Contents";

  var emailParams = {
    Destination: {
      ToAddresses: [
        "mase306.devops@gmail.com",//메일 보낼 때 logcontent에서 supervisor이메일 파싱해서 보내면 구현가능합니다.
        "wnalsrud113@gmail.com"
      ],
    },
    Message: {
      Body: {
        Text: { Data: textBody },
      },
      Subject: { Data: subject },
    },
    Source: "mase306.devops@gmail.com",
  };

  return ses.sendEmail(emailParams).promise();
};
