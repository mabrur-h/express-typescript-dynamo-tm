import {CreateTableInput} from "aws-sdk/clients/dynamodb";
import {SignUpDto, VerifyCodeDto} from "../dto/auth.dto";
import AWS from "aws-sdk";
import config from "config";
import {v4 as uuid} from 'uuid';
import {HttpException} from "../exceptions/HttpException";
import {ErrorsEnum} from "../enum/errors.enum";
import randomNumber from "../utils/randomNumber";
import {generateCrypt} from '../utils/bcrypt'


AWS.config.update({
  region: config.get<string>('awsRegion'),
  accessKeyId: config.get<string>('awsAccessKey'),
  secretAccessKey: config.get<string>('awsSecretKey')
})

const dynamoDB = new AWS.DynamoDB()
const dynamoClient = new AWS.DynamoDB.DocumentClient();

export const createUser = async (createUserInput: SignUpDto) => {
  const id = uuid();

  const genNumber = randomNumber();

  const params = {
    TableName: "USER",
    Item: {
      PK: id,
      SK: 'profile',
      name: createUserInput.name,
      email: createUserInput.email,
      password: await generateCrypt(createUserInput.password),
      verificationCode: genNumber,
      verified: false
    },
    ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(email)",
  }

  const user = await getUserByEmail(createUserInput.email)
  if (user.Count)
    throw new HttpException(403, ErrorsEnum.FORBIDDEN_ERROR, "Email already exists!");

  await dynamoClient.put(params).promise()

  return {
    id,
    verificationCode: genNumber
  }
}

export const getUserById = async (id: string) => {
  const params = {
    Key: {
      "PK": id,
      "SK": "profile"
    },
    TableName: "USER"
  };
  const result = await dynamoClient.get(params).promise()
  return result.Item
};

export const getUserByEmail = async (email: string) => {
  let params = {
    TableName: 'USER',
    FilterExpression: '#email =:email',
    ExpressionAttributeValues: { ':email': email },
    ExpressionAttributeNames: { '#email': 'email' }
  }

  const result = await dynamoClient.scan(params).promise()
  return result
};

export const verifyUserByCode = async (code: VerifyCodeDto, id: string) => {
  const user = await getUserById(id)
  if (!Object.keys({user}).length)
    throw new HttpException(404, ErrorsEnum.USER_NOT_EXISTS, "User not exists!")

  if (user?.verified)
    throw new HttpException(400, ErrorsEnum.FORBIDDEN_ERROR, "User already verified!")

  if (user?.verificationCode === code) {
    const params = {
      TableName: "USER",
      Key: {
        PK: id,
        SK: 'profile'
      },
      UpdateExpression: "set verified = :verified",
      ExpressionAttributeValues:{
        ":verified": true
      },
      ReturnValues:"UPDATED_NEW"
    }

    return await dynamoClient.update(params).promise();
  }

  throw new HttpException(400, ErrorsEnum.FORBIDDEN_ERROR, "Could not verify user!")
}

export const updateVerificationCode = async (id: string, verificationCode: number) => {
  const userData = await getUserById(id)
  if (!Object.keys({userData}).length)
    throw new HttpException(404, ErrorsEnum.USER_NOT_EXISTS, "User not exists!")

  const params = {
    TableName: "USER",
    Key: {
      PK: id,
      SK: 'profile'
    },
    UpdateExpression: "set passwordResetCode = :passwordResetCode",
    ExpressionAttributeValues:{
      ":passwordResetCode": verificationCode
    },
    ReturnValues:"UPDATED_NEW"
  }

  return await dynamoClient.update(params).promise();
}

export const updatePassword = async (id: string, password: string) => {
  const params = {
    TableName: "USER",
    Key: {
      PK: id,
      SK: 'profile'
    },
    UpdateExpression: "set passwordResetCode = :passwordResetCode, password = :password",
    ExpressionAttributeValues:{
      ":passwordResetCode": null,
      ":password": await generateCrypt(password)
    },
    ReturnValues:"UPDATED_NEW"
  }

  return await dynamoClient.update(params).promise();
}

export const createSession = async (id: { userId: string }) => {
  const sessionId = uuid()

  const params = {
    TableName: "USER",
    Item: {
      PK: id.userId,
      SK: `session_${sessionId}`,
      valid: true
    }
  }

  await dynamoClient.put(params).promise()

  return {
    session: sessionId
  }
}
