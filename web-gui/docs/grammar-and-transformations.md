# Grammar and Transformations

## Grammar (LL(1) for expressions)
```
Expr     → Term ExprTail
ExprTail → + Term ExprTail | - Term ExprTail | ε
Term     → Unary TermTail
TermTail → * Unary TermTail | / Unary TermTail | ε
Unary    → + Unary | - Unary | Primary
Primary  → NUMBER | IDENTIFIER | ( Expr )
```
Statement level (added for variables): `Statement → IDENTIFIER = Expr | Expr`.

## Transformations
The supplied grammar is **already right-recursive** (tails instead of `Expr → Expr + Term`), so **no left-recursion elimination was needed** and no change was made to it. The tail rules alone would produce right-leaning trees; the parser keeps **left associativity** by folding each tail into the AST in a loop (`10 - 3 - 2` = `(10 - 3) - 2`).

`Statement` is not LL(1): both alternatives can start with IDENTIFIER. The parser resolves it with **two-token lookahead** (IDENTIFIER followed by `=`), i.e. LL(2) at that single point. `Expr` and below are LL(1).

## FIRST sets
| Symbol | FIRST |
|---|---|
| Primary | NUMBER, IDENTIFIER, ( |
| Unary, Term, Expr | +, -, NUMBER, IDENTIFIER, ( |
| ExprTail | +, -, ε |
| TermTail | *, /, ε |

## FOLLOW sets
| Symbol | FOLLOW |
|---|---|
| Expr, ExprTail | $, ) |
| Term, TermTail | +, -, $, ) |
| Unary, Primary | *, /, +, -, $, ) |

## LL(1) table (Expr and below)
| | NUMBER | IDENT | ( | ) | + | - | * | / | $ |
|---|---|---|---|---|---|---|---|---|---|
| Expr | Term ExprTail | Term ExprTail | Term ExprTail | | Term ExprTail | Term ExprTail | | | |
| ExprTail | | | | ε | + Term ExprTail | - Term ExprTail | | | ε |
| Term | Unary TermTail | Unary TermTail | Unary TermTail | | Unary TermTail | Unary TermTail | | | |
| TermTail | | | | ε | ε | ε | * Unary TermTail | / Unary TermTail | ε |
| Unary | Primary | Primary | Primary | | + Unary | - Unary | | | |
| Primary | NUMBER | IDENTIFIER | ( Expr ) | | | | | | |

No cell has two entries, so the expression grammar is LL(1). Empty cells are syntax errors.

## Design decisions
- Implicit multiplication `2(3+4)` is **rejected** (not in the grammar).
- Numbers like `.5` or `5.` are not accepted; a decimal needs digits on both sides of `.`.
- Variables: one statement per line; a variable must be assigned on an earlier line; the last line gives the result.
