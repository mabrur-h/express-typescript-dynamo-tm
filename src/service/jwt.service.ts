import {IUser} from "../interfaces/user.interface";
import {signJwt} from "../utils/jwt";
import {createSession} from "../model/user.model";
import {HttpException} from "../exceptions/HttpException";
import {ErrorsEnum} from "../enum/errors.enum";

export class JwtService {
  public async signRefreshToken({userId}: { userId: string }) {
    try {
      const session = await createSession({
        userId,
      });

      const refreshToken = await signJwt(
        {
          session: session,
        },
        "refreshTokenPrivateKey",
        {
          expiresIn: "1y",
        }
      );

      return refreshToken;
    } catch (e) {
      throw new HttpException(400, ErrorsEnum.BAD_REQUEST_ERROR, 'Error from sign refresh token')
    }
  }
  public async signAccessToken(user: IUser) {
    try {
      const accessToken = await signJwt(user, "accessTokenPrivateKey", {
        expiresIn: '30m'
      })

      return accessToken
    } catch (e) {
      throw new HttpException(400, ErrorsEnum.BAD_REQUEST_ERROR, 'Error from sign access token')
    }
  }
}
