export default {
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
  awsRegion: process.env.AWS_REGION,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPublicKey: process.env.REFRESH_TOKEN_PUBLIC_KEY,
  awsSecretKey: process.env.AWS_SECRET_KEY,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID
}