import { v4 as uuidv4 } from 'uuid';

export const generateUserId = (): string => {
  return uuidv4();
};

export const generatePostId = (): string => {
  return uuidv4();
};
