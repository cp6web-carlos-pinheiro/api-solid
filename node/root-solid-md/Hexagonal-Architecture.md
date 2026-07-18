# Hexagonal Architecture (Ports & Adapters)

**Hexagonal Architecture** (also known as **Ports & Adapters**) is an architectural pattern introduced by Alistair Cockburn. It separates the core business logic of an application from external concerns (databases, web frameworks, message queues, APIs, etc.) by placing the domain at the center and connecting everything else through **ports** (interfaces) and **adapters** (implementations).

---

## 1. Core Idea

The application **core** (domain logic) has no knowledge of the outside world.

All interactions occur through well-defined **ports** (interfaces) that are implemented by **adapters** for specific technologies.

* **Inside the hexagon:** Pure domain logic with no framework or infrastructure code.
* **Ports:** Interfaces that define what the core *offers* to external actors (inbound/driving ports) and what the core *requires* from external systems (outbound/driven ports).
* **Adapters:** Concrete implementations that translate between ports and specific technologies.

---

## 2. Ports – The Contracts

A port is an interface that the core depends on, but never on its implementation.

```typescript
// Driving (inbound) port – what the outside world can do
interface PlaceOrderUseCase {
  execute(order: Order): Promise<OrderId>;
}

// Driven (outbound) port – what the core needs from infrastructure
interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: OrderId): Promise<Order | null>;
}
```

The core implements `PlaceOrderUseCase` and uses `OrderRepository` without knowing whether the data is stored in PostgreSQL, MongoDB, a file system, or another persistence mechanism.

---

## 3. Adapters – The Implementations

Adapters connect specific technologies to ports. They should not contain business rules.

```typescript
// MySQL adapter implementing the driven port
class MySqlOrderRepository implements OrderRepository {
  async save(order: Order): Promise<void> {
    // Executes INSERT INTO orders ...
  }

  async findById(id: OrderId): Promise<Order | null> {
    // Executes SELECT ... WHERE id = ?
  }
}

// REST adapter using the driving port
class OrderController {
  constructor(private placeOrder: PlaceOrderUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const order = parseOrderFromRequest(request);
    const id = await this.placeOrder.execute(order);

    return {
      status: 201,
      body: { id }
    };
  }
}
```

---

## 4. Why a Hexagon?

The hexagonal shape is only a visual metaphor—it is **not** about having exactly six sides.

* You can have as many ports as your application requires.
* The domain remains at the center.
* External systems are treated as interchangeable details.
* User interfaces, databases, messaging systems, and third-party APIs all have equal status.

```text
             +-----------+
            /             \
           /    DOMAIN     \
          /     (Core)      \
         +       +       +   +
         |      Port     |   |
         +---------------+---+
          \                 /
           \               /
            \_____________/
             |           |
       [DB Adapter] [UI Adapter]
```

*Simplified example showing two adapters. In practice, many adapters may exist.*

---

## 5. Benefits

### Testability

The core can be tested using mock or fake adapters without requiring databases, APIs, or network access.

### Flexibility

Changing a database, replacing a framework, or exposing a new interface often requires only adapter modifications.

### Maintainability

Business logic remains isolated from infrastructure and framework changes.

### Team Autonomy

Different teams can work independently on adapters and domain logic.

---

## 6. When to Use It

Hexagonal Architecture is particularly useful when:

* Supporting multiple clients (web, mobile, CLI, event-driven consumers).
* You want to postpone technology decisions.
* External integrations may change over time.
* Following Domain-Driven Design principles.
* Long-term maintainability is a priority.

It may be unnecessary for very small applications with limited complexity.

---

## 7. Rule of Thumb

> **The core should never import anything from the adapters.**

All dependency arrows point inward, toward the domain.

```text
Adapter ──► Port (interface) ◄── Core
```

The domain defines the contracts, and the infrastructure adapts to them.

---

### In One Sentence

**Hexagonal Architecture keeps business rules independent of external technologies by isolating the domain behind ports and adapters.**
