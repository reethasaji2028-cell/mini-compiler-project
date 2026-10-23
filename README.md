# Arithmetic Expression Mini-Compiler

> **A comprehensive Front-End Compiler Architecture combining a Modular C Engine and an Interactive Web Visualizer.**  
> Built for **Compiler Design (CS / IT / Software Engineering)**.

---

## 📌 Project Overview

This repository provides a complete, dual-paradigm implementation of an **Arithmetic Expression Compiler**:
1. **`c-compiler/` (Systems CLI Engine)**: Written in C99, implementing manual tokenization, recursive-descent parsing, AST synthesis with explicit memory management (`malloc`/`free`), and static semantic verification.
2. **`web-gui/` (Interactive Educational Visualizer)**: Written in modern HTML/CSS/vanilla JavaScript (zero external dependencies, zero `eval`), visualizing live tokens, concrete parse trees, abstract syntax trees, dynamic symbol tables, and safe multi-line evaluation.

```
+------------------------------------------------------------------------------------+
|                               COMPILER PIPELINE                                    |
|                                                                                    |
|  [ Source Text ]                                                                   |
|        │                                                                           |
|        ▼                                                                           |
|  ┌─────────────────────┐   Token Stream                                            |
|  │ 1. Lexical Analysis │ ───────────────► Type, Lexeme, Line:Col                   |
|  └─────────────────────┘                                                           |
|        │                                                                           |
|        ▼                                                                           |
|  ┌─────────────────────┐   Syntax Validation & Trees                               |
|  │ 2. Syntax Analysis  │ ───────────────► Concrete Parse Tree & AST                |
|  └─────────────────────┘                                                           |
|        │                                                                           |
|        ▼                                                                           |
|  ┌─────────────────────┐   Semantic Validation                                     |
|  │ 3. Semantic Analysis│ ───────────────► Symbol Table, Scope & Div-by-Zero Checks |
|  └─────────────────────┘                                                           |
|        │                                                                           |
|        ▼                                                                           |
|  ┌─────────────────────┐   Execution                                               |
|  │ 4. AST Evaluator    │ ───────────────► Final Evaluated Result / Diagnostics     |
|  └─────────────────────┘                                                           |
+------------------------------------------------------------------------------------+
```

---

## 👥 Module Distribution & Team Contributions

| Module | C Implementation (`c-compiler/`) | Web Visualizer (`web-gui/`) | Responsibilities |
|---|---|---|---|
| **Lexical Analysis (Member 2)** | [`lexer.c`](c-compiler/lexer.c), [`lexer.h`](c-compiler/lexer.h) | [`js/lexer.js`](web-gui/js/lexer.js) | Scans raw characters into typed tokens (`TOK_NUM`, `TOK_ID`, `TOK_PLUS`, etc.), strips whitespace, handles floats, flags illegal characters. |
| **Syntax Analysis (Member 3)** | [`parser.c`](c-compiler/parser.c), [`parser.h`](c-compiler/parser.h), [`parser.c`](parser.c) | [`js/parser.js`](web-gui/js/parser.js), [`js/grammar.js`](web-gui/js/grammar.js) | Implements recursive-descent parsing for the LL(1) grammar, resolves left-associativity, and constructs the AST on-the-fly. |
| **AST & Semantics (Member 4)** | [`ast.c`](c-compiler/ast.c), [`ast.h`](c-compiler/ast.h) | [`js/ast.js`](web-gui/js/ast.js), [`js/semantic.js`](web-gui/js/semantic.js) | Manages AST nodes, post-order cleanup (`ast_free`), symbol table tracking, declaration-before-use verification, and division-by-zero detection. |
| **Driver & Visualizer** | [`main.c`](c-compiler/main.c) | [`js/compiler.js`](web-gui/js/compiler.js), [`js/ui.js`](web-gui/js/ui.js), [`js/main.js`](web-gui/js/main.js) | CLI interface and interactive web dashboard with fail-fast pipeline stage monitoring. |

---

## 📂 Repository Structure

```
mini-compiler-project/
├── c-compiler/                          # C-based CLI Mini-Compiler
│   ├── ast.c                           # AST node construction & semantic checks
│   ├── ast.h                           # AST node struct & function declarations
│   ├── lexer.c                         # Character scanner & token recognition
│   ├── lexer.h                         # Token enum, Token struct & lexer header
│   ├── parser.c                        # Recursive-descent grammar parser
│   ├── parser.h                        # Parser interface (parse_expression, get_ast_root)
│   ├── main.c                          # Integrated CLI compiler driver
│   └── mini_compiler.exe               # Pre-compiled executable for Windows
│
├── web-gui/                             # Interactive Browser GUI Compiler
│   ├── css/
│   │   └── style.css                   # Dark-themed responsive layout styling
│   ├── docs/
│   │   └── grammar-and-transformations.md # FIRST/FOLLOW sets & LL(1) parsing table
│   ├── js/
│   │   ├── ast.js                      # AST node factories & display serialization
│   │   ├── compiler.js                 # 5-stage pipeline orchestrator (fail-fast)
│   │   ├── evaluator.js                # Recursive AST interpreter (safe, no eval)
│   │   ├── grammar.js                  # Production rules shown in the UI
│   │   ├── lexer.js                    # JavaScript tokenizer with column hints
│   │   ├── main.js                     # UI event wiring & preset examples
│   │   ├── parser.js                   # Recursive-descent parser (Parse tree + AST)
│   │   ├── semantic.js                 # Symbol table & variable declaration validator
│   │   └── ui.js                       # DOM rendering of tokens, trees, and symbols
│   ├── tests/
│   │   └── test-runner.js              # 34 automated unit & edge-case test cases
│   └── index.html                      # Single-page web visualizer entry point
│
├── parser.c                             # Member 3 Parser implementation (root copy)
├── parser.h                             # Member 3 Parser header (root copy)
└── README.md                            # Complete project documentation
```

---

## 📐 Formal Grammar Specification

### Context-Free Grammar (LL(1) for Expressions)
```
Statement → IDENTIFIER = Expr | Expr
Expr      → Term ExprTail
ExprTail  → + Term ExprTail | - Term ExprTail | ε
Term      → Unary TermTail
TermTail  → * Unary TermTail | / Unary TermTail | ε
Unary     → + Unary | - Unary | Primary
Primary   → NUMBER | IDENTIFIER | ( Expr )
```

### Grammar Design Decisions:
1. **No Left Recursion**: The naive rule $E \to E + T$ is transformed to right-recursive tail rules ($E \to T E'$) to prevent infinite call loops in recursive descent.
2. **Left Associativity Preserved**: In both C (`while` loop in `E()` and `T()`) and JavaScript (`chain()` loop), operators are folded so that previous nodes become the **left child** of new nodes, guaranteeing $(10 - 3) - 2 = 5$.
3. **LL(2) Statement Resolution**: Both `IDENTIFIER = Expr` and `Expr` can begin with `IDENTIFIER`. The parser inspects **2 tokens ahead** (`IDENTIFIER` followed by `=`) to identify assignment statements.

---

## 🚀 Quick Start & Execution Guide

### 1. Running the Interactive Web GUI
Simply double-click [`web-gui/index.html`](web-gui/index.html) to open the visualizer in any modern browser (or use VS Code "Live Server").

- **Features**: Live Token Table, Concrete Parse Tree, Abstract Syntax Tree, Symbol Table, and stage-by-stage error diagnostics.
- **Preset buttons**: Test Precedence, Left Associativity, Decimals, Multi-line Variables, and intentional error cases with one click.

---

### 2. Running the C Mini-Compiler

#### On Windows (Using Pre-compiled Executable):
```powershell
cd c-compiler
.\mini_compiler.exe
```
Or pass an expression via pipe:
```powershell
echo "2 + 3 * 4" | .\mini_compiler.exe
echo "10 / 0"     | .\mini_compiler.exe
```

#### Compiling from Source (GCC / Clang):
```bash
cd c-compiler
gcc main.c lexer.c parser.c ast.c -o mini_compiler
./mini_compiler
```

---

## 🧪 Verified Test Cases

| Input Expression | Expected Result / Diagnostic | Phase Caught |
|---|---|---|
| `2 + 3 * 4` | Evaluates to `14`; `*` is right-child of `+` in AST | Evaluation |
| `(2 + 3) * 4` | Evaluates to `20`; `+` is nested child of `*` | Evaluation |
| `100 / 10 / 2` | Evaluates to `5` (left-associative folding) | Evaluation |
| `-5 + 8` | Evaluates to `3` (unary minus handled) | Evaluation |
| `12.5 + 2.5` | Evaluates to `15` (floating-point decimals supported) | Evaluation |
| `x = 4`<br>`y = 6`<br>`x + y * 2` | Evaluates to `16`; `x` and `y` tracked in Symbol Table | Evaluation |
| `2 + * 3` | Syntax Error: expected operand after operator | Syntax Analysis |
| `(2 + 3` | Syntax Error: missing closing `)` | Syntax Analysis |
| `2 $ 3` | Lexical Error: invalid character `$` | Lexical Analysis |
| `price * 2` | Semantic Error: undefined variable `price` | Semantic Analysis |
| `10 / 0` | Semantic Error: division by literal zero | Semantic Analysis |

---
