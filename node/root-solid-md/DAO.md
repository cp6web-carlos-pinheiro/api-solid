# Data Access Object (DAO) Pattern

The **Data Access Object (DAO)** pattern is a design pattern that abstracts and encapsulates all access to a data source.

A DAO acts as a layer between the application business logic and the database, providing a clear API for performing CRUD (Create, Read, Update, Delete) operations without exposing database implementation details.

---

## 1. Purpose of the DAO Pattern

The primary goal of a DAO is to separate **data access logic** from **business logic**.

Instead of allowing application services or use cases to communicate directly with the database, they interact with a DAO that handles all persistence concerns.

### Without DAO

```text
Use Case
    ↓
Database
```

### With DAO

```text
Use Case
    ↓
UserDAO
    ↓
Database
```

This separation improves maintainability, testability, and flexibility.

---

## 2. Example

The following `UserDAO` is responsible for accessing user data stored in the database.

```typescript
import { eq } from "drizzle-orm";

import { InputDTO, OutputDTO } from "../../applications/usecases/CreateUser";
import { db } from "../db/client";
import { usersTable } from "../db/schema";

export class UserDAO {
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
```

---

## 3. Understanding the Example

### `findByEmail()`

This method retrieves a user from the database using their email address.

```typescript
async findByEmail(email: string): Promise<OutputDTO> {
    const [existingUser] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

    return existingUser;
}
```

**Responsibility:**

* Executes the database query.
* Maps the database result.
* Returns the user data.

The use case does not need to know how the query is built or which ORM is being used.

---

### `create()`

This method inserts a new user into the database.

```typescript
async create(user: InputDTO): Promise<OutputDTO> {
    const [existingUser] = await db
        .insert(usersTable)
        .values(user)
        .returning();

    return existingUser;
}
```

**Responsibility:**

* Persists user data.
* Executes the insert operation.
* Returns the created record.

Again, the application layer does not need to know SQL syntax or Drizzle ORM specifics.

---

## 4. How the DAO Is Used

A use case can delegate persistence operations to the DAO.

```typescript
export class CreateUser {
    constructor(private readonly userDAO: UserDAO) {}

    async execute(input: InputDTO): Promise<OutputDTO> {
        const existingUser = await this.userDAO.findByEmail(input.email);

        if (existingUser) {
            throw new Error("User already exists");
        }

        return this.userDAO.create(input);
    }
}
```

### Flow

```text
CreateUser Use Case
        │
        ▼
      UserDAO
        │
        ▼
   Drizzle ORM
        │
        ▼
     Database
```

The use case focuses on business rules, while the DAO handles persistence.

---

## 5. Benefits

### Separation of Concerns

Business logic remains independent from database implementation details.

### Reusability

Multiple use cases can reuse the same DAO methods.

### Maintainability

Database-related changes are isolated within the DAO layer.

### Testability

DAOs can be mocked during unit testing.

```typescript
const userDAOMock = {
    findByEmail: jest.fn(),
    create: jest.fn()
};
```

This allows testing business rules without requiring a real database.

### Encapsulation

The application does not need to know:

* SQL syntax
* Table names
* ORM-specific APIs
* Database connection details

---

## 6. DAO vs Repository

The terms are often used interchangeably, but there is a subtle difference.

### DAO

Focuses on data persistence and database operations.

```typescript
userDAO.findByEmail(email);
userDAO.create(user);
```

### Repository

Represents a collection of domain objects and is more closely aligned with Domain-Driven Design (DDD).

```typescript
userRepository.findByEmail(email);
userRepository.save(user);
```

In simple applications, a DAO and a Repository may look very similar.

---

## 7. Best Practices

### Keep Business Logic Out of DAOs

A DAO should not contain validation or business rules.

❌ Bad

```typescript
if (user.age < 18) {
    throw new Error("User must be an adult");
}
```

✅ Good

```typescript
// Business rule handled in the use case
if (input.age < 18) {
    throw new Error("User must be an adult");
}

await userDAO.create(input);
```

---

### Keep DAOs Focused on Persistence

A DAO should be responsible for:

* Querying data
* Inserting data
* Updating data
* Deleting data

It should not manage application workflows.

---

## 8. Rule of Thumb

> **A DAO knows how to talk to the database, but it does not know the business rules of the application.**

The application layer decides **what** should happen, while the DAO knows **how** to persist and retrieve data.

---

### In One Sentence

**The DAO pattern centralizes database access behind a dedicated class, allowing business logic to remain independent from persistence details and database technologies.**
