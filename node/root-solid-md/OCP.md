# Open/Closed Principle (OCP)

> **"Software entities should be open for extension, but closed for modification."**
> **"Entidades de software devem estar abertas para extensão, mas fechadas para modificação."**
> — Bertrand Meyer

O **Open/Closed Principle (OCP)** é o **"O"** dos princípios **SOLID**.

Ele afirma que uma classe deve permitir a adição de novos comportamentos **sem que seja necessário modificar seu código existente**. Em vez de alterar uma classe sempre que surge uma nova regra, devemos estendê-la por meio de abstrações, herança ou composição.

---

## 1. Por que isso é importante?

Imagine uma classe responsável por calcular descontos.

Inicialmente, ela suporta apenas clientes comuns.

```typescript
const discount = new DiscountCalculator();
```

Quando surge um novo tipo de cliente (Premium, VIP, etc.), você modifica a mesma classe para adicionar mais `if` ou `switch`.

Com o tempo, essa classe cresce, fica difícil de manter e aumenta o risco de quebrar funcionalidades já existentes.

O Open/Closed Principle evita esse problema permitindo adicionar novos comportamentos sem alterar o código já testado.

---

## 2. Sem OCP (Exemplo Ruim)

A classe precisa ser modificada sempre que um novo tipo de desconto é criado.

```typescript
export class DiscountCalculator {

    calculate(type: string, value: number): number {

        if (type === "regular") {
            return value * 0.95;
        }

        if (type === "premium") {
            return value * 0.90;
        }

        if (type === "vip") {
            return value * 0.80;
        }

        throw new Error("Invalid customer type");
    }

}
```

### Problemas

* A classe precisa ser alterada sempre que surge um novo tipo de cliente.
* O número de condicionais cresce continuamente.
* Alterações aumentam o risco de introduzir bugs.
* O código fica mais difícil de manter.

---

## 3. Aplicando OCP

Primeiro, criamos uma abstração para representar uma estratégia de desconto.

```typescript
export interface DiscountStrategy {
    calculate(value: number): number;
}
```

A interface define **o que** deve ser feito, sem definir **como**.

---

## 4. Implementações Concretas

Cada tipo de desconto possui sua própria implementação.

```typescript
export class RegularDiscount implements DiscountStrategy {

    calculate(value: number): number {
        return value * 0.95;
    }

}
```

```typescript
export class PremiumDiscount implements DiscountStrategy {

    calculate(value: number): number {
        return value * 0.90;
    }

}
```

```typescript
export class VipDiscount implements DiscountStrategy {

    calculate(value: number): number {
        return value * 0.80;
    }

}
```

Cada classe possui apenas sua própria regra de negócio.

---

## 5. Dependendo da Abstração

Agora o cálculo recebe qualquer estratégia que implemente a interface.

```typescript
export class DiscountCalculator {

    constructor(private strategy: DiscountStrategy) {}

    calculate(value: number): number {
        return this.strategy.calculate(value);
    }

}
```

A classe não precisa conhecer os diferentes tipos de desconto.

---

## 6. Fluxo da Solução

Sem OCP:

```text
DiscountCalculator
        │
        ├── if Regular
        ├── if Premium
        ├── if VIP
        └── if ...
```

Cada novo tipo exige modificar a classe.

---

Com OCP:

```text
             DiscountStrategy
                    ▲
        ┌───────────┼───────────┐
        │           │           │
   Regular    Premium      VIP
        │           │           │
        └───────────┼───────────┘
                    │
          DiscountCalculator
```

Novas regras são adicionadas criando novas implementações, sem alterar o código existente.

---

## 7. Estendendo o Sistema

Se surgir um novo tipo de desconto, basta criar outra implementação.

```typescript
export class BlackFridayDiscount implements DiscountStrategy {

    calculate(value: number): number {
        return value * 0.70;
    }

}
```

Nenhuma linha da `DiscountCalculator` precisa ser modificada.

---

## 8. Benefícios

### Fácil Extensão

Novos comportamentos podem ser adicionados sem alterar classes existentes.

### Menor Risco

Como o código já testado não é modificado, diminui a chance de introduzir erros.

### Melhor Organização

Cada classe possui apenas uma responsabilidade.

### Maior Escalabilidade

O sistema cresce por meio de novas implementações, não pela alteração das antigas.

---

## 9. OCP na Prática

O OCP costuma ser implementado utilizando:

* Interfaces
* Classes abstratas
* Estratégias (Strategy Pattern)
* Composição
* Polimorfismo

Essas técnicas permitem adicionar funcionalidades sem alterar o comportamento existente.

---

## 10. Regra de Ouro

Sempre que precisar modificar uma classe para adicionar um novo comportamento, pergunte:

> **"Existe uma forma de estender essa funcionalidade em vez de alterar o código existente?"**

Na maioria dos casos, a resposta será criar uma nova implementação baseada em uma abstração.

---

### Em Uma Frase

**O Open/Closed Principle incentiva o desenvolvimento de classes abertas para extensão, mas fechadas para modificação, permitindo adicionar novas funcionalidades sem alterar o código existente.**
