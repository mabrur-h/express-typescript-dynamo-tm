import AWS from 'aws-sdk'
import config from 'config'

AWS.config.update({
  region: config.get<string>('awsRegion'),
  accessKeyId: config.get<string>('awsAccessKey'),
  secretAccessKey: config.get<string>('awsSecretKey')
})

const dynamoDB = new AWS.DynamoDB()
const dynamoClient = new AWS.DynamoDB.DocumentClient();

// Call DynamoDB to create the table
/*dynamoDB.createTable(userTableParams, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table Created", data);
  }
});*/