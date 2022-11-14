import {NextFunction, Response, Request} from "express"
import {HttpException} from "../exceptions/HttpException"

const errorHandlerMiddleware = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const resError = {
      status: err.status || 500,
      error: err.error || 'INTERNAL_ERROR',
      message: err.message || 'Something went wrong!'
    }

    console.error(`${req.method} -> ${req.path} ==> STATUS_CODE: ${resError.status}, ERROR: ${resError.error}, MESSAGE: ${resError.message}`)

    res.status(resError.status).json({...resError})
  } catch (e) {
    console.error(`${req.method} -> ${req.path} ==> ERROR: ${e}`)
  }
}

export default errorHandlerMiddleware