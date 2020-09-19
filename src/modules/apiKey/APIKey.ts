import { Ctx, Query, Resolver } from 'type-graphql';
import { Context } from '../auth/middleware/Context';
import { getKey } from './controllers/getAPIKey';
import { refreshAPIKey } from './controllers/refreshAPIKey';

@Resolver()
export class APIKeyResolver {
  @Query(() => String)
  async getAPIKey(@Ctx() ctx: Context): Promise<string | never> {
    return getKey(ctx);
  }

  @Query(() => String)
  async refreshAPIKey(@Ctx() ctx: Context) {
    return refreshAPIKey(ctx);
  }
}
