import bcrypt from "bcrypt";

import { UserDAO } from "../../resources/daos/UserDAO";
import { EmailAlreadyExistsError, InvalidMarketingChannelError, PasswordDoNotMatchError, UserCreationError } from "../errors";

export interface InputDTO {
    name: string;
    age: number;
    phoneNumber: string;
    email: string;
    password: string;
    passwordConfirmation?: string;
    preferredMarketingChannel: string;
}

export interface OutputDTO {
    id: string;
    name: string;
    email: string;
    age: number;
    phoneNumber: string;
    preferredMarketingChannel: string;
}

export class CreateUser {
  private userDAO: UserDAO;

  constructor(userDAO: UserDAO) {
    this.userDAO = userDAO;
  }

  async execute(input: InputDTO): Promise<OutputDTO> {
    if (input.password !== input.passwordConfirmation) {
      throw new PasswordDoNotMatchError();
    }
    const existingUser = await this.userDAO.findByEmail(input.email);
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
    const user = await this.userDAO.create({
      name: input.name,
      age: input.age,
      phoneNumber: input.phoneNumber,
      email: input.email,
      password: await bcrypt.hash(input.password, 10),
      preferredMarketingChannel: input.preferredMarketingChannel,
    });
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