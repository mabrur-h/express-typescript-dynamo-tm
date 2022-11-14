import {CreateTableInput} from "aws-sdk/clients/dynamodb";
import {SignUpDto, VerifyCodeDto} from "../dto/auth.dto";
import AWS from "aws-sdk";
import config from "config";
import {v4 as uuid} from 'uuid';
import {TaskDto} from "../dto/task.dto";

AWS.config.update({
  region: config.get<string>('awsRegion'),
  accessKeyId: config.get<string>('awsAccessKey'),
  secretAccessKey: config.get<string>('awsSecretKey')
})

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const userTableParams: CreateTableInput = {
  "AttributeDefinitions": [
    {
      "AttributeName": "PK",
      "AttributeType": "S"
    },
    {
      "AttributeName": "SK",
      "AttributeType": "S"
    },
  ],
  "TableName": "USER",
  "KeySchema": [
    {
      "AttributeName": "PK",
      "KeyType": "HASH"
    },
    {
      "AttributeName": "SK",
      "KeyType": "RANGE"
    }
  ],
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 5,
    "WriteCapacityUnits": 5
  }
}

export const createTask = async (userId: string, createTaskInput: TaskDto) => {
  const id = uuid();

  const params = {
    TableName: "USER",
    Item: {
      PK: userId,
      SK: `task_${id}`,
      title: createTaskInput.title,
      description: createTaskInput.description
    }
  }

  await dynamoClient.put(params).promise()

  return {
    taskId: id
  }
}

export const editTask = async (userId: string, createTaskInput: TaskDto, taskId: string) => {
  const params = {
    TableName: "USER",
    Key: {
      PK: userId,
      SK: `task_${taskId}`
    },
    UpdateExpression: "set title = :title, description = :description",
    ExpressionAttributeValues:{
      ":title": createTaskInput.title,
      ":description": createTaskInput.description
    },
    ReturnValues:"UPDATED_NEW"
  }

  return await dynamoClient.update(params).promise();
}

export const getTaskById = async (userId: string, taskId: string) => {
  const params = {
    Key: {
      "PK": userId,
      "SK": `task_${taskId}`
    },
    TableName: "USER"
  };
  const result = await dynamoClient.get(params).promise()
  return result.Item
}

export const getTasks = async (userId: string) => {
  const params = {
      TableName: 'USER',
      KeyConditionExpression: 'PK = :PK AND begins_with(SK, :SK)',
      ExpressionAttributeValues: {
        ':PK': userId,
        ':SK': `task`
      }
    };

  const result = await dynamoClient.query(params).promise()
  return result
}

export const getTasksByTitle = async (title: string, userId: string) => {
  const params = {
    TableName: 'USER',
    FilterExpression: 'PK = :PK AND begins_with(SK, :SK) AND contains(title, :title)',
    ExpressionAttributeValues: {
      ':PK': userId,
      ':SK': `task`,
      ':title': title
    }
  };

  const result = await dynamoClient.scan(params).promise()
  return result.Items
}

export const deleteTaskById = async (userId: string, taskId: string) => {
  const params = {
    TableName: "USER",
    Key: {
      PK: userId,
      SK: `task_${taskId}`
    },
  }

  return await dynamoClient.delete(params).promise();
}

export default userTableParams