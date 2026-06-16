# Single Responsibility Principle (SRP)

> **"A class should have one, and only one, reason to change."**
> — Robert C. Martin

The **Single Responsibility Principle (SRP)** is the **"S"** in the **SOLID** principles of object-oriented design.

It states that a module, class, or function should be responsible for **one specific concern** within the system. In other words, it should have **only one reason to change**.

A responsibility represents a cohesive set of behaviors that serve a particular purpose or stakeholder.

---

## 1. Why Does It Matter?

When a class handles multiple responsibilities, several problems emerge:

### Fragility

Changes made for one concern can unintentionally break another.

### Complexity

The class becomes harder to understand, test, debug, and extend.

### Team Friction

Multiple developers working on unrelated features may modify the same class, increasing merge conflicts and coordination overhead.

### Reduced Reusability

A class tightly coupled to many concerns becomes difficult to reuse in different contexts.

By following SRP, code becomes more **modular**, **maintainable**, and **easier to evolve**.

---

## 2. Violation (Bad) Example

The following class violates SRP because it has **three different reasons to change**:

* Report generation requirements change.
* File persistence requirements change.
* Email delivery requirements change.

```java id="r9xk2m"
// This class violates SRP.
class Report {

    void generateReport() {
        // Logic for generating report data
    }

    void saveToFile(String path) {
        // Logic for writing to disk
    }

    void sendEmail(String to) {
        // Logic for sending via SMTP
    }
}
```

### Responsibilities Mixed Together

```text id="s4jd8a"
┌─────────────────────────────────────┐
│              Report                 │
├─────────────────────────────────────┤
│ + generateReport(): void            │
│ + saveToFile(path: String): void    │
│ + sendEmail(to: String): void       │
└─────────────────────────────────────┘
```

This single class is responsible for:

1. Business logic (creating reports).
2. Infrastructure concerns (saving files).
3. Communication concerns (sending emails).

These responsibilities evolve independently and should not be coupled together.

---

## 3. Refactored (Good) Example

Separate each concern into its own class, allowing each one to focus on a single purpose.

```java id="m2q7pe"
class ReportGenerator {

    ReportData generate() {
        // Logic for generating report data
    }
}

class ReportSaver {

    void saveToFile(ReportData data, String path) {
        // Logic for writing to disk
    }
}

class EmailSender {

    void send(ReportData data, String to) {
        // Logic for sending via SMTP
    }
}
```

### Responsibilities Properly Separated

```text id="c7nb4f"
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│ ReportGenerator   │   │   ReportSaver     │   │   EmailSender     │
├───────────────────┤   ├───────────────────┤   ├───────────────────┤
│ + generate(): ... │   │ + saveToFile(... )│   │ + send(...): ...  │
└───────────────────┘   └───────────────────┘   └───────────────────┘
```

Now, each class has a single reason to change:

* **ReportGenerator:** Changes when report-generation rules evolve.
* **ReportSaver:** Changes when persistence mechanisms evolve.
* **EmailSender:** Changes when email delivery requirements evolve.

---

## 4. Key Benefits

### Testability

Small, focused classes can be unit-tested in isolation without unnecessary dependencies.

### Reusability

Components such as `EmailSender` can be reused throughout the application.

### Maintainability

Changes remain localized, reducing the risk of unintended side effects.

### Readability

Classes communicate their intent clearly, making the codebase easier to understand.

### Flexibility

Replacing implementations becomes simpler because responsibilities are not intertwined.

---

## 5. How to Spot SRP Violations

### Look for Conjunctions

Class or method names containing words such as **"and"** or **"or"** may indicate multiple responsibilities.

Examples:

```text id="h6vt2d"
parseAndSave()
validateAndSend()
loadOrCreate()
```

---

### Identify Multiple Triggers

Ask yourself:

> "Could this class change for different, unrelated reasons?"

If the answer is yes, SRP may be violated.

---

### Watch for Bloated Classes

Warning signs include:

* Excessively long files.
* Large numbers of imports.
* Unrelated dependencies.
* Methods that serve very different purposes.

---

### Apply the Actor Rule

Consider who requests changes to the class.

> If multiple stakeholders or business actors could independently require modifications, the class likely has more than one responsibility.

For example:

* The accounting team changes report calculations.
* The infrastructure team changes storage requirements.
* The operations team changes email delivery rules.

These are separate concerns and should be represented by separate units of code.

---

## 6. Common Misconceptions

### "One method per class"

SRP does **not** mean a class should contain only one method.

A class may have many methods, provided they all contribute to the **same responsibility**.

---

### "Small classes automatically follow SRP"

A small class can still violate SRP if it mixes unrelated concerns.

The goal is not size—it's **cohesion**.

---

## 7. Rule of Thumb

When reviewing a class, ask:

> **"What is the single reason this class should change?"**

If you can identify more than one answer, consider splitting the responsibilities.

---

### In One Sentence

**The Single Responsibility Principle encourages designing classes around a single, cohesive purpose so that each unit of code has only one reason to change.**
