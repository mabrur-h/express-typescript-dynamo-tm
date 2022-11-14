import {Router} from "express"
import validateErrorMiddleware from "../middleware/validate-error.middleware";
import {AuthController} from "../controller/auth.controller";
import CreateUserSchema from "../schema/user/create-user.schema";
import VerifyUserSchema from "../schema/user/verify-user.schema";
import ForgotPasswordSchema from "../schema/user/forgot-password.schema";
import ResetPasswordSchema from "../schema/user/reset-password.schema";
import LoginUserSchema from "../schema/user/login-user.schema";
import authMiddleware from "../middleware/auth.middleware";

class AuthRoute {
  public path = '/auth'
  public router = Router()
  public authController = new AuthController()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, validateErrorMiddleware(CreateUserSchema), this.authController.userSignUp);
    this.router.post(`${this.path}/forgot-password`, validateErrorMiddleware(ForgotPasswordSchema), this.authController.forgotPassword);
    this.router.post(`${this.path}/reset-password/:id`, validateErrorMiddleware(ResetPasswordSchema), this.authController.resetPassword);
    this.router.post(`${this.path}/session`, validateErrorMiddleware(LoginUserSchema), this.authController.createSession);
    this.router.patch(`${this.path}/verify/:id`, validateErrorMiddleware(VerifyUserSchema), this.authController.verifyUserHandler);
    this.router.get(`${this.path}/me`, authMiddleware, this.authController.getCurrentUser);
    this.router.get(`${this.path}/:id`, this.authController.getOneUser);
  }
}

export default AuthRoute