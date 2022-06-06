import { genSalt, hash as doHash, compare } from 'bcryptjs';

export const hash = async (input: string, s?: string): Promise<string> => {
  const salt = s ?? (await genSalt());
  return await doHash(input, salt);
};

export const valid = async (data: string, hashed: string) => {
  return await compare(data, hashed);
};
