import { ApolloError } from 'apollo-server-express';
import { KeyModel } from '../../../models/Key';
import { generateAPIKey } from '../../../subscriptions/middleware/APIkeys';
import { getTokenUserID } from '../../auth/jwt/getTokenUserID';
import { Context } from '../../auth/middleware/Context';

export const refreshAPIKey = async (ctx: Context) => {
  const userID = getTokenUserID(ctx);

  try {
    const APIKey = await KeyModel.findOne({ userID });

    if (!APIKey) {
      throw new ApolloError('No API Key for user', 'INTERNAL_SERVER_ERROR');
    }

    const key = generateAPIKey();
    APIKey.key = key;
    const result = await APIKey.save();

    return result.key;
  } catch (error) {
    throw new ApolloError(error, 'DATABASE_ERROR');
  }
};
