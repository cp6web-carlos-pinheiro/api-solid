import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { z } from "zod/v4";

import { EmailAlreadyExistsError, InvalidMarketingChannelError, PasswordDoNotMatchError, UserCreationError } from "../applications/errors";
import { CreateUser } from "../applications/usecases/CreateUser";
import { UserRepositoryDrizzle } from "../resources/repositories/UserRepository";

export const buildApp = () => {
  const app = fastify();
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "SampleApi",
        description: "Sample backend service",
        version: "1.0.0",
      },
      servers: [],
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
  });

  app.after(() => {
    app.withTypeProvider<ZodTypeProvider>().route({
      method: "POST",
      url: "/users",
      schema: {
        body: z.object({
          name: z.string().trim().min(1),
          age: z.number().int().min(18).max(100),
          phoneNumber: z.string().startsWith("+55").trim().min(1),
          email: z.email(),
          password: z.string().min(8),
          passwordConfirmation: z.string().min(8),
          preferredMarketingChannel: z.enum([
            "email",
            "sms",
            "push",
            "whatsapp",
          ]),
        }),
        response: {
          201: z.object({
            id: z.uuid(),
            name: z.string(),
            age: z.number(),
            phoneNumber: z.string(),
            email: z.string(),
            preferredMarketingChannel: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
          409: z.object({
            error: z.string(),
          }),
          500: z.object({
            error: z.string(),
          }),
        },
      },
      handler: async (req, res) => {
        try {
          const createUser = new CreateUser(new UserRepositoryDrizzle);
          const output = await createUser.execute(req.body);
          return res.status(201).send(output);
        } catch (error) {
          if (error instanceof PasswordDoNotMatchError) {
            return res.status(400).send({ error: error.message });
          }
          if (error instanceof EmailAlreadyExistsError) {
            return res.status(409).send({ error: error.message });
          }
          if (error instanceof InvalidMarketingChannelError) {
            return res.status(400).send({ error: error.message });
          }
          if (error instanceof UserCreationError) {
            return res.status(500).send({ error: error.message });
          }
          return res.status(500).send({ error: "Error creating user" });
        }
      },
    });
  });
  return app;
};