import { eq } from "drizzle-orm";
import { User } from "../../applications/entities/User";
import { db } from "../db/client";
import { usersTable } from "../db/schema";

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
}

export class UserRepositoryDrizzle implements UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const [existingUser] = await db
           .select()
           .from(usersTable)
           .where(eq(usersTable.email, email));
        return existingUser;
    }

    async create(user: User): Promise<User> {
        const [createdUser] = await db
            .insert(usersTable)
            .values(user)
            .returning();
        return createdUser;
    }
}