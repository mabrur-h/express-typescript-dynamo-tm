import jwt from "jsonwebtoken";
import config from "config";
import {HttpException} from "../exceptions/HttpException";
import {ErrorsEnum} from "../enum/errors.enum";

export async function signJwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  try {
    return jwt.sign(object, config.get<string>(keyName));
  } catch (e) {
    throw new HttpException(403, ErrorsEnum.UNAUTHORIZED, 'Access Token Error')
  }
}

export async function verifyJwt(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
) {
  try {
    const decoded = jwt.verify(token, config.get<string>(keyName));
    return decoded;
  } catch (e) {
    throw new HttpException(403, ErrorsEnum.UNAUTHORIZED, 'Access Token Error')
  }
}
