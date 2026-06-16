import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../../resources/db/client";
import { usersTable } from "../../resources/db/schema";
import { EmailAlreadyExistsError, InvalidMarketingChannelError, PasswordDoNotMatchError, UserCreationError } from "../errors";

interface InputDTO {
    name: string;
    age: number;
    phoneNumber: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    preferredMarketingChannel: string;
}

interface OutputDTO {
    id: string;
    name: string;
    email: string;
    age: number;
    phoneNumber: string;
    preferredMarketingChannel: string;
}

export class CreateUser {
    async execute(input: InputDTO): Promise<OutputDTO> {
        if (input.password !== input.passwordConfirmation) {
            throw new PasswordDoNotMatchError();
          }
          const [existingUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, input.email));
          if (existingUser) {
            throw new EmailAlreadyExistsError();
          }
          if (
            !["email", "sms", "push", "whatsapp"].includes(
              input.preferredMarketingChannel
            )
          ) {
            throw new InvalidMarketingChannelError();
          }
          const [user] = await db
            .insert(usersTable)
            .values({
              name: input.name,
              age: input.age,
              phoneNumber: input.phoneNumber,
              email: input.email,
              password: await bcrypt.hash(input.password, 10),
              preferredMarketingChannel: input.preferredMarketingChannel,
            })
            .returning();
          if (!user) {
            throw new UserCreationError();
          }
          return {
            id: user.id,
            name: user.name,
            age: user.age,
            phoneNumber: user.phoneNumber,
            email: user.email,
            preferredMarketingChannel: user.preferredMarketingChannel,
          };
    }
}