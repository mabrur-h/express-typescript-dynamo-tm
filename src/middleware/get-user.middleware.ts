import {Request, NextFunction} from "express";
import {verifyJwt} from "../utils/jwt";

const GetUserMiddleware = async (req: Request, res: any, next: NextFunction) => {
  try {
    const accessToken = (req.headers.authorization || "").replace(/^Bearer\s/, "")
    if (!accessToken) {
      return next()
    }

    const decoded = await verifyJwt(accessToken, "accessTokenPublicKey")

    if (decoded) {
      res.locals.user = decoded
    }

    return next()
  } catch (e) {
    next(e)
  }
}

export default GetUserMiddleware