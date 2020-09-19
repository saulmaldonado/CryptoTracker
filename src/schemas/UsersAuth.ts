import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserAuth {
  @Field()
  _id!: string;

  @Field()
  public username!: string;

  @Field()
  public email!: string;

  @Field()
  public email_verified!: boolean;
}
