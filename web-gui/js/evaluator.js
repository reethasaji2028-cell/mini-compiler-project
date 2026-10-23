// Safe recursive AST evaluator (no eval / new Function).
(function (g) {
  function evalNode(n, env) {
    switch (n.type) {
      case 'Number': return n.value;
      case 'Identifier': return env.get(n.name);
      case 'Unary': { const v = evalNode(n.operand, env); return n.op === '-' ? -v : v; }
      case 'Binary': {
        const a = evalNode(n.left, env), b = evalNode(n.right, env);
        if (n.op === '+') return a + b;
        if (n.op === '-') return a - b;
        if (n.op === '*') return a * b;
        if (b === 0) throw { message: 'Division by zero', line: n.line, col: n.col, hint: 'The divisor evaluated to 0.' };
        return a / b;
      }
      case 'Assign': { const v = evalNode(n.value, env); env.set(n.name, v); return v; }
    }
  }
  g.Evaluator = { evalNode, format: x => parseFloat(x.toPrecision(12)) };
})(typeof window !== 'undefined' ? window : globalThis);
