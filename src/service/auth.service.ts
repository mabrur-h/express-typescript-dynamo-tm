import {SignUpDto, VerifyCodeDto} from "../dto/auth.dto";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  updateVerificationCode,
  verifyUserByCode
} from "../model/user.model";

export class AuthService {
  public async signUp(userData: SignUpDto) {
    return await createUser(userData);
  }
  public async verifyUser(code: VerifyCodeDto, id: string) {
    return await verifyUserByCode(code, id)
  }
  public async updateResetCode(id: string, verificationCode: number) {
    return await updateVerificationCode(id, verificationCode)
  }
  public async getOneUser(id: string) {
    return await getUserById(id)
  }
  public async getOneUserByEmail(email: string) {
    return await getUserByEmail(email)
  }
  public async updateUserPassword(id: string, password: string) {
    return await updatePassword(id, password)
  }
}