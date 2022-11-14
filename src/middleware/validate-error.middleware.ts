import {NextFunction, Request, Response} from "express"
import {HttpException} from "../exceptions/HttpException";
import {ErrorsEnum} from "../enum/errors.enum";

const validateErrorMiddleware = (val: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = val.validate(req.body)
      if (body.error?.details)
        throw new HttpException(400, ErrorsEnum.VALIDATION_ERROR, body.error.details[0]?.message)

      next()
    } catch (e) {
      console.error(`${req.method} -> ${req.path} ==> ERROR: ${e}`)
      next(e)
    }
  }
}

export default validateErrorMiddleware