export class SignUpDto {
  name: string;
  password: string;
  repeat_password: string;
  email: string;
}

export class VerifyCodeDto {
  verificationCode: number
}