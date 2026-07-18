import { eq } from "drizzle-orm";

import { InputDTO, OutputDTO } from "../../applications/usecases/CreateUser";
import { db } from "../db/client";
import { usersTable } from "../db/schema";

export interface UserDAO {
    findByEmail(email: string): Promise<OutputDTO>;
    create(user: InputDTO): Promise<OutputDTO>;
}

export class UserDAODrizzle implements UserDAO {
    async findByEmail(email: string): Promise<OutputDTO> {
        const [existingUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));
        return existingUser;
    }
    async create(user: InputDTO): Promise<OutputDTO> {
        const [existingUser] = await db
            .insert(usersTable)
            .values(user)
            .returning();
        return existingUser;
    }
}