# Dependency Inversion Principle (DIP)

> **"High-level modules should not depend on low-level modules. Both should depend on abstractions."**
> **"Abstractions should not depend on details. Details should depend on abstractions."**
> — Robert C. Martin

The **Dependency Inversion Principle (DIP)** is the **"D"** in the **SOLID** principles of object-oriented design.

It states that business logic should depend on **interfaces (abstractions)** rather than concrete implementations. This allows components to remain loosely coupled, making applications easier to test, maintain, and extend.

---

## 1. Why Does It Matter?

Imagine a use case that directly creates and uses a database implementation.

```typescript
const userDAO = new UserDAODrizzle();
```

Now the use case is tightly coupled to Drizzle ORM. If you later decide to use Prisma, MongoDB, or an in-memory database for testing, you'll need to modify the business logic.

The Dependency Inversion Principle solves this problem by introducing an abstraction between the business logic and the infrastructure.

---

## 2. Without DIP (Bad Example)

In this example, the use case depends directly on a concrete implementation.

```typescript id="pw4u8r"
export class CreateUser {
    private userDAO = new UserDAODrizzle();

    async execute(input: InputDTO) {
        const existingUser = await this.userDAO.findByEmail(input.email);

        if (existingUser) {
            throw new Error("User already exists");
        }

        return this.userDAO.create(input);
    }
}
```

### Problems

* The use case is tightly coupled to Drizzle.
* Switching to another database requires modifying the use case.
* Unit testing becomes more difficult because a real database dependency exists.
* The business layer now knows infrastructure details.

---

## 3. Applying DIP

First, define an interface that represents the abstraction.

```typescript id="p1z9xy"
export interface UserDAO {
    findByEmail(email: string): Promise<OutputDTO>;
    create(user: InputDTO): Promise<OutputDTO>;
}
```

The interface describes **what** operations are available, but not **how** they are implemented.

---

## 4. Concrete Implementation

The infrastructure layer implements the interface.

```typescript id="tx7rbe"
export class UserDAODrizzle implements UserDAO {

    async findByEmail(email: string): Promise<OutputDTO> {
        // Drizzle ORM query
    }

    async create(user: InputDTO): Promise<OutputDTO> {
        // Drizzle ORM insert
    }
}
```

The implementation contains all the database-specific logic.

If the persistence technology changes, only this class changes.

---

## 5. Depending on the Abstraction

Instead of creating the DAO internally, the use case receives it through its constructor.

```typescript id="9lmk6c"
export class CreateUser {
    private userDAO: UserDAO;

    constructor(userDAO: UserDAO) {
        this.userDAO = userDAO;
    }

    async execute(input: InputDTO): Promise<OutputDTO> {
        const existingUser = await this.userDAO.findByEmail(input.email);

        if (existingUser) {
            throw new Error("User already exists");
        }

        return this.userDAO.create(input);
    }
}
```

Notice that `CreateUser` knows only about the `UserDAO` interface.

It has no knowledge of Drizzle, SQL, or any database technology.

---

## 6. Dependency Flow

Without DIP:

```text id="a4jtx1"
CreateUser
      │
      ▼
UserDAODrizzle
      │
      ▼
 Database
```

The business layer directly depends on infrastructure.

---

With DIP:

```text id="z8pf1k"
          UserDAO (Interface)
               ▲
               │
      ┌────────┴────────┐
      │                 │
CreateUser      UserDAODrizzle
                      │
                      ▼
                  Database
```

Now both the high-level module (`CreateUser`) and the low-level module (`UserDAODrizzle`) depend on the same abstraction.

---

## 7. Dependency Injection

DIP is commonly implemented using **Dependency Injection (DI)**.

Instead of creating dependencies internally, they are provided from the outside.

```typescript id="6xg2vf"
const userDAO = new UserDAODrizzle();

const createUser = new CreateUser(userDAO);
```

The use case doesn't care which implementation it receives.

It only requires that the object implements the `UserDAO` interface.

---

## 8. Benefits

### Loose Coupling

Business logic remains independent of infrastructure.

### Easier Testing

You can inject a fake or mock implementation.

```typescript id="3pjm4q"
const fakeUserDAO: UserDAO = {
    async findByEmail() {
        return undefined;
    },

    async create(user) {
        return user as OutputDTO;
    }
};

const createUser = new CreateUser(fakeUserDAO);
```

No real database is required for testing.

---

### Flexibility

Replacing Drizzle with another ORM requires only a new implementation.

```typescript id="tk5f7n"
class UserDAOPrisma implements UserDAO {}

class UserDAOMongo implements UserDAO {}

class UserDAOInMemory implements UserDAO {}
```

The `CreateUser` use case remains unchanged.

---

### Better Maintainability

Changes to infrastructure do not ripple into the business layer.

Each layer evolves independently.

---

## 9. DIP vs Dependency Injection

These concepts are related but different.

### Dependency Inversion Principle (DIP)

A **design principle** stating that code should depend on abstractions instead of concrete implementations.

### Dependency Injection (DI)

A **technique** used to provide dependencies from the outside.

Think of it this way:

* **DIP** is the architectural principle.
* **DI** is one way to implement that principle.

---

## 10. Rule of Thumb

Whenever you see code like this inside your business logic:

```typescript id="n0fr3b"
new UserDAODrizzle()
```

Ask yourself:

> **"Should this class really know which database implementation it is using?"**

In most cases, the answer is **no**.

Instead, depend on an interface and inject the implementation.

---

### In One Sentence

**The Dependency Inversion Principle encourages high-level business logic to depend on abstractions rather than concrete implementations, reducing coupling and making applications easier to test, maintain, and extend.**
