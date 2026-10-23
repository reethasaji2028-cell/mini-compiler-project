// Recursive-descent parser: one function per grammar rule. Builds parse tree + AST together.
(function (g) {
  function parse(tokens) {
    let p = 0;
    const peek = () => tokens[p], next = () => tokens[p++];
    const err = (message, t, hint) => { throw { message, line: t.line, col: t.col, hint }; };
    const N = (name, children = [], lexeme) => ({ name, children, lexeme });
    const leaf = t => N(t.type, [], t.lexeme);
    const describe = t => t.type === 'EOF' ? 'end of input' : `'${t.lexeme}'`;

    // Shared loop for ExprTail / TermTail: keeps the AST left-associative.
    function chain(name, tailName, ops, sub) {
      const first = sub();
      const pt = N(name, [first.pt]);
      let ast = first.ast, cur = pt;
      while (ops.includes(peek().type)) {
        const op = next(), rhs = sub();
        ast = AST.binary(op, ast, rhs.ast);
        const tail = N(tailName, [leaf(op), rhs.pt]);
        cur.children.push(tail); cur = tail;
      }
      cur.children.push(N('ε'));
      return { pt, ast };
    }
    const expr = () => chain('Expr', 'ExprTail', ['PLUS', 'MINUS'], term);
    const term = () => chain('Term', 'TermTail', ['MUL', 'DIV'], unary);
    function unary() {
      const t = peek();
      if (t.type === 'PLUS' || t.type === 'MINUS') {
        next(); const u = unary();
        return { pt: N('Unary', [leaf(t), u.pt]), ast: AST.unary(t, u.ast) };
      }
      const pr = primary();
      return { pt: N('Unary', [pr.pt]), ast: pr.ast };
    }
    function primary() {
      const t = peek();
      if (t.type === 'NUMBER') { next(); return { pt: N('Primary', [leaf(t)]), ast: AST.number(t) }; }
      if (t.type === 'IDENTIFIER') { next(); return { pt: N('Primary', [leaf(t)]), ast: AST.identifier(t) }; }
      if (t.type === 'LPAREN') {
        next(); const e = expr(), c = peek();
        if (c.type !== 'RPAREN') err(`Missing ')' for '(' opened at column ${t.col}`, c, 'Every ( needs a matching ).');
        next();
        return { pt: N('Primary', [leaf(t), e.pt, leaf(c)]), ast: e.ast };
      }
      if (t.type === 'EOF') err('Unexpected end of input; an operand was expected', t, 'The expression is incomplete (for example it ends with an operator).');
      err(`Unexpected ${describe(t)}; expected a number, identifier, '(' or unary sign`, t, 'An operand must follow an operator (e.g. 2 + * 3 is invalid).');
    }
    // Statement → IDENTIFIER = Expr | Expr
    let id = null, eq = null;
    if (peek().type === 'IDENTIFIER' && tokens[p + 1].type === 'ASSIGN') { id = next(); eq = next(); }
    const e = expr(), t = peek();
    if (t.type === 'RPAREN') err("Unmatched ')'", t, 'This ) has no matching (.');
    if (t.type !== 'EOF') err(`Unexpected ${describe(t)}; an operator was expected`, t,
      'Operators are required between operands. Implicit multiplication such as 2(3+4) is not supported.');
    return id
      ? { pt: N('Statement', [leaf(id), leaf(eq), e.pt]), ast: AST.assign(id, eq, e.ast) }
      : { pt: N('Statement', [e.pt]), ast: e.ast };
  }
  g.Parser = { parse };
})(typeof window !== 'undefined' ? window : globalThis);
