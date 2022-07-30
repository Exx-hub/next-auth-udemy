import { hash, compare } from "bcrypt";

export const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);

  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  return await compare(password, hashedPassword);
};
