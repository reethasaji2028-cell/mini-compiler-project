// AST node factories and a helper that converts nodes into a displayable tree.
(function (g) {
  const at = t => ({ line: t.line, col: t.col });
  g.AST = {
    number: t => ({ type: 'Number', value: parseFloat(t.lexeme), ...at(t) }),
    identifier: t => ({ type: 'Identifier', name: t.lexeme, ...at(t) }),
    unary: (t, operand) => ({ type: 'Unary', op: t.lexeme, operand, ...at(t) }),
    binary: (t, left, right) => ({ type: 'Binary', op: t.lexeme, left, right, ...at(t) }),
    assign: (id, eq, value) => ({ type: 'Assign', name: id.lexeme, value, ...at(eq) }),
    toDisplay(n) {
      switch (n.type) {
        case 'Number': return { label: `Number ${n.value}`, children: [] };
        case 'Identifier': return { label: `Identifier ${n.name}`, children: [] };
        case 'Unary': return { label: `Unary ${n.op}`, children: [this.toDisplay(n.operand)] };
        case 'Binary': return { label: `Binary ${n.op}`, children: [this.toDisplay(n.left), this.toDisplay(n.right)] };
        case 'Assign': return { label: `Assign ${n.name} =`, children: [this.toDisplay(n.value)] };
      }
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
