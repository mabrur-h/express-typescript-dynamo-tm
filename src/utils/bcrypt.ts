import bcrypt from 'bcrypt';

export const generateCrypt = async (data: string) => {
  return bcrypt.hash(data, await bcrypt.genSalt(10));
}

export const compareCrypt = async (data: string, crypt: string) => {
  return bcrypt.compare(data, crypt)
}