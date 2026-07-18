# Liskov Substitution Principle (LSP)

> **"Objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program."**
> **"Objetos de uma superclasse devem poder ser substituídos por objetos de suas subclasses sem alterar o comportamento correto do programa."**
> — Barbara Liskov

O **Liskov Substitution Principle (LSP)** é o **"L"** dos princípios **SOLID**.

Ele afirma que uma classe derivada deve poder substituir sua classe base **sem alterar o comportamento esperado da aplicação**. Em outras palavras, quem utiliza uma abstração não deve precisar saber qual implementação concreta está sendo utilizada.

---

## 1. Por que isso é importante?

Imagine uma aplicação que trabalha com diferentes tipos de aves.

Todas elas possuem um método para voar.

```typescript
const bird: Bird = new Sparrow();
bird.fly();
```

Depois, surge uma nova classe representando um pinguim.

Como pinguins não voam, alguém decide sobrescrever o método lançando uma exceção.

Agora qualquer código que espera uma `Bird` pode falhar inesperadamente.

O Liskov Substitution Principle evita esse tipo de problema garantindo que subclasses mantenham os contratos definidos pela classe base.

---

## 2. Sem LSP (Exemplo Ruim)

A classe derivada altera o comportamento esperado.

```typescript
export class Bird {

    fly(): void {
        console.log("Flying...");
    }

}
```

```typescript
export class Penguin extends Bird {

    fly(): void {
        throw new Error("Penguins cannot fly.");
    }

}
```

Agora imagine um código que recebe qualquer ave.

```typescript
function makeBirdFly(bird: Bird): void {
    bird.fly();
}

makeBirdFly(new Penguin());
```

Resultado:

```text
Error: Penguins cannot fly.
```

---

### Problemas

* A subclasse quebra o comportamento esperado da classe base.
* O código cliente precisa conhecer exceções específicas.
* O polimorfismo deixa de funcionar corretamente.
* A abstração perde sua confiabilidade.

---

## 3. Aplicando LSP

Em vez de assumir que toda ave voa, criamos abstrações que representam comportamentos reais.

Primeiro, definimos uma abstração para qualquer ave.

```typescript
export abstract class Bird {

    abstract eat(): void;

}
```

Agora criamos outra abstração apenas para aves que voam.

```typescript
export interface FlyingBird {

    fly(): void;

}
```

---

## 4. Implementações Concretas

Um pardal é uma ave que voa.

```typescript
export class Sparrow extends Bird implements FlyingBird {

    eat(): void {
        console.log("Eating...");
    }

    fly(): void {
        console.log("Flying...");
    }

}
```

Já um pinguim continua sendo uma ave, mas não precisa implementar algo que não faz.

```typescript
export class Penguin extends Bird {

    eat(): void {
        console.log("Eating...");
    }

}
```

Cada classe implementa apenas os comportamentos que realmente possui.

---

## 5. Dependendo da Abstração Correta

Agora, funções que precisam de uma ave voadora recebem apenas objetos que podem voar.

```typescript
function makeBirdFly(bird: FlyingBird): void {
    bird.fly();
}
```

Uso:

```typescript
makeBirdFly(new Sparrow());
```

Já o pinguim pode ser utilizado normalmente onde apenas uma ave é necessária.

```typescript
const bird: Bird = new Penguin();

bird.eat();
```

Nenhum comportamento inesperado acontece.

---

## 6. Fluxo da Solução

Sem LSP:

```text
        Bird
          │
     fly()
          ▲
          │
      Penguin
          │
throw Error()
```

A subclasse viola o comportamento esperado.

---

Com LSP:

```text
            Bird
             ▲
      ┌──────┴──────┐
      │             │
 Sparrow       Penguin
      │
implements
      │
 FlyingBird
```

Cada classe implementa apenas os comportamentos compatíveis com sua natureza.

---

## 7. Estendendo o Sistema

Se surgir uma nova ave que voa, basta implementar a interface.

```typescript
export class Eagle extends Bird implements FlyingBird {

    eat(): void {
        console.log("Eating...");
    }

    fly(): void {
        console.log("Flying high...");
    }

}
```

Nenhuma classe existente precisa ser alterada.

---

## 8. Benefícios

### Polimorfismo Confiável

Qualquer implementação pode substituir sua abstração sem causar comportamentos inesperados.

### Código Mais Seguro

Evita exceções geradas por implementações incompatíveis.

### Melhor Modelagem

As abstrações representam corretamente o domínio da aplicação.

### Maior Manutenibilidade

Novas implementações podem ser adicionadas sem quebrar funcionalidades existentes.

---

## 9. LSP na Prática

O LSP costuma ser aplicado utilizando:

* Interfaces bem definidas
* Classes abstratas
* Polimorfismo
* Composição
* Modelagem correta do domínio

Mais importante do que utilizar herança é garantir que as subclasses respeitem os contratos definidos pela abstração.

---

## 10. Regra de Ouro

Sempre que criar uma classe derivada, pergunte:

> **"Essa classe pode substituir sua abstração sem alterar o comportamento esperado do sistema?"**

Se a resposta for não, provavelmente a hierarquia de herança está incorreta e deve ser repensada.

---

### Em Uma Frase

**O Liskov Substitution Principle garante que subclasses possam substituir suas classes base sem alterar o comportamento esperado da aplicação, preservando contratos, polimorfismo e a confiabilidade das abstrações.**