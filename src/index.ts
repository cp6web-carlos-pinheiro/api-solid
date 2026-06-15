import Fastify from "fastify";

const fastify = Fastify();

fastify.get("/", (request, reply) => {
  reply.send({ hello: "World" });
});

fastify.post("/users", (request, reply) => {
    reply.send({ hello: "World" });
});

await fastify.listen({ port: 3000 });

console.log(`Server is running on http://localhost:3000`);