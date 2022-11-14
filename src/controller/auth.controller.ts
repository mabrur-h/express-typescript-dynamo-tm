import {NextFunction, Request, Response} from 'express'
import {AuthService} from "../service/auth.service";
import {SignUpDto} from "../dto/auth.dto";
import {getUserById} from "../model/user.model";
import {HttpException} from "../exceptions/HttpException";
import {ErrorsEnum} from "../enum/errors.enum";
import {User} from '../interfaces/user.interface';
import randomNumber from "../utils/randomNumber";
import {compareCrypt} from "../utils/bcrypt";
import {JwtService} from "../service/jwt.service";

export class AuthController {
  public authService = new AuthService()
  public jwtService = new JwtService()

  public userSignUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: SignUpDto = req.body
      const user: User = await this.authService.signUp(userData);

      // We can send verification code to email from here

      res.status(201).json({
        user: {
          id: user.id,
          verificationCode: user.verificationCode,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        }
      })
    } catch (e) {
      console.error(e)
      next(e)
    }
  }

  public verifyUserHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {verificationCode} = req.body
      const {id} = req.params
      await this.authService.verifyUser(verificationCode, id)

      res.status(200).json({
        message: "User successfully verified!"
      })
    } catch (e) {
      console.error(e)
      next(e)
    }
  }

  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      const data = await this.authService.getOneUserByEmail(email);

      const user: User | null = data.Items ? data.Items[0] : null
      if (!user)
        throw new HttpException(400, ErrorsEnum.FORBIDDEN_ERROR, "User with this email does not exist!")

      if (!user.PK)
        throw new HttpException(400, ErrorsEnum.FORBIDDEN_ERROR, "User with this email does not exist!")

      if (!user.verified)
        throw new HttpException(400, ErrorsEnum.FORBIDDEN_ERROR, "User is not verified!")

      const passwordResetCode = randomNumber();

      await this.authService.updateResetCode(user.PK, passwordResetCode)

      res.status(200).json({
        message: "User will receive password reset email!",
        resetCode: passwordResetCode,
        userId: user.PK
      })
    } catch (e) {
      next(e)
    }
  }

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const { password, passwordResetCode } = req.body;

      const user = await this.authService.getOneUser(id);

      if (!Object.keys({user}).length)
        throw new HttpException(404, ErrorsEnum.USER_NOT_EXISTS, "User not exists!")

      if (
        !user ||
        !user.passwordResetCode ||
        user.passwordResetCode !== passwordResetCode
      ) {
        throw new HttpException(400, ErrorsEnum.FORBIDDEN_ERROR, "Could not reset user password!")
      }

      await this.authService.updateUserPassword(id, password)

      res.status(201).json({
        message: "Password successfully updated!",
      })
    } catch (e) {
      next(e)
    }
  }

  public createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {email, password} = req.body

      const data = await this.authService.getOneUserByEmail(email)
      const user: User | null = data.Items ? data.Items[0] : null
      if (!user)
        throw new HttpException(404, ErrorsEnum.USER_NOT_EXISTS, "User with this email does not exist!")

      if (!user.PK)
        throw new HttpException(404, ErrorsEnum.USER_NOT_EXISTS, "User with this email does not exist!")

      if (!user.verified)
        throw new HttpException(403, ErrorsEnum.FORBIDDEN_ERROR, "User is not verified!")

      if (!user.password)
        throw new HttpException(403, ErrorsEnum.FORBIDDEN_ERROR, "Something went wrong!")

      const userPassword: string = user.password

      const passwordIsValid = await compareCrypt(password, userPassword)

      if (!passwordIsValid)
        throw new HttpException(403, ErrorsEnum.FORBIDDEN_ERROR, "Password is incorrect!")

      const accessToken = await this.jwtService.signAccessToken(user)

      const refreshToken = await this.jwtService.signRefreshToken({userId: user.PK})

      res.status(200).json({
        accessToken,
        refreshToken
      })
    } catch (e) {
      next(e)
    }
  }

  public getOneUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const user = await getUserById(id)

      res.status(200).json({
        user
      })
    } catch (e) {
      console.error(e)
      next(e)
    }
  }

  public getCurrentUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const currentUser = res.locals.user

      res.status(200).json({
        currentUser
      })
    } catch (e) {
      next(e)
    }
  }
}