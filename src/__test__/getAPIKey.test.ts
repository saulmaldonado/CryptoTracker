import { mongoose } from '@typegoose/typegoose';
import { config } from 'dotenv';
import { KeyModel } from '../models/Key';
import { Context } from '../modules/auth/middleware/Context';
import * as tokenMethods from '../modules/auth/jwt/getTokenUserID';
import { getKey } from '../modules/apiKey/controllers/getAPIKey';
import { generateAPIKey } from '../modules/apiKey/controllers/helpers/keyFunctions';
import { redis } from '../utils/redisCache';

config();

const userID: string = 'auth0|5f6aa02c4419aa00717f9ee8';

beforeAll(async () => {
  await mongoose.connect(`${process.env.MONGO_URI}/test5`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('getAPIKey: controller', () => {
  let getTokenUserIDMock: jest.SpyInstance<string, [Context]>;

  beforeAll(() => {
    getTokenUserIDMock = jest.spyOn(tokenMethods, 'getTokenUserID');
    getTokenUserIDMock.mockImplementation(() => userID);
  });

  afterAll(() => {
    getTokenUserIDMock.mockRestore();
    redis.disconnect();
  });

  afterEach(async () => {
    await KeyModel.deleteMany({});
  });

  it('should return a new APIKey object', async () => {
    const APIKey = await getKey({} as Context);

    expect(APIKey).toEqual({
      key: expect.any(String),
      timestamp: expect.any(Date),
    });
  });

  describe('getAPIKey: controller existing key in db', () => {
    let encryptedKey;
    let iv;
    let _id;
    let timestamp: Date;
    let key: string;

    beforeAll(async () => {
      ({ encryptedKey, iv, _id, timestamp, key } = generateAPIKey({} as Context));

      await KeyModel.create({ _id, encryptedKey, iv, timestamp, userID });
    });

    it('should return the same existing APIKey object', async () => {
      const APIKey = await getKey({} as Context);

      expect(APIKey).toEqual({
        key,
        timestamp,
      });
    });
  });
});