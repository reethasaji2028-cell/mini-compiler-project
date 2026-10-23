// Semantic analyzer: checks every identifier is defined before use and builds the symbol table.
// Statements are processed top to bottom, so a variable must be assigned on an EARLIER line.
(function (g) {
  function analyze(statements) {
    const table = new Map(), info = [];
    function check(n, line) {
      switch (n.type) {
        case 'Identifier': {
          const s = table.get(n.name);
          if (!s) throw { message: `Undefined variable '${n.name}'`, line: n.line, col: n.col,
            hint: `Assign it first on an earlier line, e.g. ${n.name} = 5` };
          s.uses++; info.push(`Line ${line}: '${n.name}' is defined (line ${s.line}) ✔`); break;
        }
        case 'Unary': check(n.operand, line); break;
        case 'Binary': check(n.left, line); check(n.right, line); break;
        case 'Assign': {
          check(n.value, line);                       // right side is checked BEFORE the name is defined
          const old = table.get(n.name);
          if (old) { old.assignments++; info.push(`Line ${line}: '${n.name}' re-assigned (last assignment wins)`); }
          else { table.set(n.name, { name: n.name, type: 'number', value: null, line, uses: 0, assignments: 1 });
                 info.push(`Line ${line}: '${n.name}' declared and added to symbol table`); }
          break;
        }
      }
    }
    statements.forEach(s => check(s.ast, s.line));
    if (!info.length) info.push('No identifiers used; nothing to resolve.');
    return { symbols: [...table.values()], info };
  }
  g.Semantic = { analyze };
})(typeof window !== 'undefined' ? window : globalThis);
