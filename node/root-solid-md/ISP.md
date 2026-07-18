# Interface Segregation Principle (ISP)

> **"Clients should not be forced to depend upon interfaces that they do not use."**
>
> **"Clientes não devem ser forçados a depender de interfaces que não utilizam."**
>
> — Robert C. Martin (Uncle Bob)

O **Interface Segregation Principle (ISP)** é o **"I"** dos princípios **SOLID**.

Ele afirma que **uma interface deve expor apenas os comportamentos realmente necessários para seus clientes**. Em vez de criar interfaces grandes e genéricas, é preferível dividir responsabilidades em interfaces menores e mais específicas.

O objetivo é evitar que classes sejam obrigadas a implementar métodos que não fazem sentido para elas.

---

# 1. Por que isso é importante?

Em uma aplicação, diferentes objetos podem compartilhar apenas parte de um conjunto de comportamentos.

Imagine um sistema que trabalha com diferentes equipamentos de escritório.

Uma impressora multifuncional consegue:

- imprimir;
- digitalizar;
- enviar fax.

Já uma impressora comum apenas imprime.

Mesmo assim, alguém cria uma única interface para todos os equipamentos.

```typescript
const printer: Machine = new BasicPrinter();
```

Agora toda implementação é obrigada a fornecer todos os métodos, mesmo aqueles que não utiliza.

Isso gera código desnecessário, implementações vazias e violações do contrato da interface.

É exatamente esse tipo de problema que o ISP procura evitar.

---

# 2. Interfaces Muito Grandes

Considere a seguinte interface.

```typescript
export interface Machine {

    print(document: string): void;

    scan(document: string): void;

    fax(document: string): void;

}
```

Ela representa todas as funcionalidades possíveis de uma máquina.

O problema é que nem todas as máquinas oferecem esses recursos.

---

# 3. Sem ISP (Exemplo Ruim)

Uma impressora simples precisa implementar todos os métodos.

```typescript
export class BasicPrinter implements Machine {

    print(document: string): void {
        console.log(`Printing: ${document}`);
    }

    scan(document: string): void {
        throw new Error("Scan not supported.");
    }

    fax(document: string): void {
        throw new Error("Fax not supported.");
    }

}
```

Agora imagine um código cliente.

```typescript
function sendDocument(machine: Machine): void {

    machine.scan("contract.pdf");

}
```

Resultado:

```text
Error: Scan not supported.
```

---

## Problemas

- A interface obriga implementações desnecessárias.
- Classes implementam métodos que nunca utilizarão.
- Surgem métodos vazios ou exceções.
- O contrato da interface perde sua confiabilidade.
- O acoplamento aumenta desnecessariamente.

O problema não está na classe.

O problema está na interface.

---

# 4. Aplicando ISP

Em vez de criar uma interface enorme, dividimos cada responsabilidade em uma abstração independente.

Interface para impressão.

```typescript
export interface Printable {

    print(document: string): void;

}
```

Interface para digitalização.

```typescript
export interface Scannable {

    scan(document: string): void;

}
```

Interface para fax.

```typescript
export interface Faxable {

    fax(document: string): void;

}
```

Agora cada interface representa apenas uma responsabilidade.

---

# 5. Implementações Corretas

Uma impressora simples implementa apenas impressão.

```typescript
export class BasicPrinter implements Printable {

    print(document: string): void {
        console.log(`Printing: ${document}`);
    }

}
```

Uma multifuncional implementa todas as capacidades.

```typescript
export class MultiFunctionPrinter
    implements Printable, Scannable, Faxable {

    print(document: string): void {
        console.log(`Printing: ${document}`);
    }

    scan(document: string): void {
        console.log(`Scanning: ${document}`);
    }

    fax(document: string): void {
        console.log(`Sending fax: ${document}`);
    }

}
```

Cada classe implementa apenas os contratos compatíveis com suas funcionalidades.

---

# 6. Dependendo da Abstração Correta

Agora um serviço de impressão depende apenas da capacidade de imprimir.

```typescript
function printDocument(printer: Printable): void {

    printer.print("report.pdf");

}
```

Já um serviço de digitalização depende apenas de quem sabe digitalizar.

```typescript
function scanDocument(scanner: Scannable): void {

    scanner.scan("contract.pdf");

}
```

Cada cliente utiliza apenas a abstração necessária.

---

# 7. Fluxo da Solução

Sem ISP

```text
          Machine
 ┌───────────────────────┐
 │ print()               │
 │ scan()                │
 │ fax()                 │
 └───────────────────────┘
            ▲
            │
    BasicPrinter
            │
 scan() -> Error
 fax()  -> Error
```

A interface força implementações que não fazem sentido.

---

Com ISP

```text
 Printable     Scannable      Faxable
     ▲              ▲             ▲
     │              │             │
     └──────┐       │             │
            │       │             │
     BasicPrinter   │             │

     ┌─────────────────────────────┐
     │ MultiFunctionPrinter        │
     └─────────────────────────────┘
          ▲      ▲       ▲
          │      │       │
     Printable Scannable Faxable
```

Cada interface representa apenas uma capacidade específica.

---

# 8. Benefícios

## Menor Acoplamento

As classes dependem apenas das funcionalidades necessárias.

---

## Contratos Mais Claros

Cada interface possui um propósito bem definido.

---

## Implementações Mais Simples

Nenhuma classe precisa implementar métodos inúteis.

---

## Melhor Reutilização

As interfaces podem ser combinadas conforme a necessidade.

---

## Maior Flexibilidade

Novas funcionalidades podem ser adicionadas sem impactar implementações existentes.

---

# 9. ISP na Prática

O ISP costuma ser aplicado utilizando:

- Interfaces pequenas;
- Interfaces coesas;
- Composição de interfaces;
- Polimorfismo;
- Separação clara de responsabilidades.

Uma boa interface normalmente representa **uma única capacidade** da aplicação.

---

# 10. Como Identificar uma Violação do ISP

Alguns sinais comuns são:

- interfaces com muitos métodos;
- implementações contendo métodos vazios;
- métodos que lançam exceções por não serem suportados;
- classes obrigadas a implementar funcionalidades desnecessárias;
- alterações em uma interface afetando diversas implementações sem necessidade.

Quando isso acontece, provavelmente a interface possui responsabilidades demais.

---

# 11. ISP e LSP

O ISP e o LSP costumam aparecer juntos, mas resolvem problemas diferentes.

O **ISP** evita que uma interface imponha comportamentos desnecessários.

O **LSP** garante que quem implementa uma abstração respeite seus contratos.

Interfaces menores reduzem significativamente as chances de violar o LSP, pois cada implementação assume apenas comportamentos que realmente consegue cumprir.

---

# 12. Regra de Ouro

Sempre que criar uma interface, pergunte:

> **Toda classe que implementar esta interface realmente precisará de todos os seus métodos?**

E também:

> **Posso dividir essa interface em contratos menores e mais específicos sem perder clareza?**

Se a resposta for **sim**, provavelmente a interface está assumindo responsabilidades demais.

---

# Em Uma Frase

**O Interface Segregation Principle garante que clientes dependam apenas das abstrações de que realmente precisam, utilizando interfaces pequenas, coesas e específicas, reduzindo acoplamento e tornando o sistema mais flexível e fácil de manter.**