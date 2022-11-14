import {NextFunction, Request, Response} from "express";
import {verifyJwt} from "../utils/jwt";
import {HttpException} from "../exceptions/HttpException";
import {ErrorsEnum} from "../enum/errors.enum";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user

    if (!user)
      throw new HttpException(401, ErrorsEnum.UNAUTHORIZED, "Authorization is required")

    next()
  } catch (e) {
    next(e)
  }
}

export default authMiddleware