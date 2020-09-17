import { Context } from '../middleware/Context';

import { decode } from 'jsonwebtoken';
import { JWTPayload } from '../middleware/authChecker';

export const getTokenUserID = ({ req }: Context): string => {
  const token = req.headers.authorization!.split(' ')[1];

  const { sub } = decode(token) as JWTPayload;

  return sub!;
};