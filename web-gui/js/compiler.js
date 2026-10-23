// Compiler driver: runs the stages in order and stops at the first failing stage.
(function (g) {
  function compile(src) {
    const r = { stages: { lexical: 'pending', syntax: 'pending', ast: 'pending', semantic: 'pending', evaluation: 'pending' },
      tokens: [], statements: [], symbols: [], info: [], results: [], errors: [], output: null };
    const fail = (stage, errs) => { r.stages[stage] = 'failed'; r.errors = [].concat(errs).map(e => ({ stage, ...e })); return r; };
    const lines = [];
    src.split(/\r?\n/).forEach((t, i) => { if (t.trim()) lines.push({ text: t, line: i + 1 }); });
    if (!lines.length) return fail('lexical', { message: 'Empty expression', line: 1, col: 1, hint: 'Type an expression such as 2 + 3 * 4.' });

    // 1. Lexical analysis
    const lexErrors = [], perLine = [];
    lines.forEach(l => {
      const { tokens, errors } = Lexer.tokenize(l.text, l.line);
      lexErrors.push(...errors); perLine.push({ line: l.line, tokens });
      r.tokens.push(...tokens.filter(t => t.type !== 'EOF'));
    });
    if (lexErrors.length) return fail('lexical', lexErrors);
    r.stages.lexical = 'success';

    // 2-3. Syntax analysis (parse tree) + AST generation
    try {
      perLine.forEach(l => { const { pt, ast } = Parser.parse(l.tokens); r.statements.push({ line: l.line, pt, ast }); });
    } catch (e) { return fail('syntax', e); }
    r.stages.syntax = 'success'; r.stages.ast = 'success';

    // 4. Semantic analysis
    try { const s = Semantic.analyze(r.statements); r.symbols = s.symbols; r.info = s.info; }
    catch (e) { return fail('semantic', e); }
    r.stages.semantic = 'success';

    // 5. Evaluation
    const env = new Map();
    try {
      r.statements.forEach(s => r.results.push({ line: s.line, value: Evaluator.format(Evaluator.evalNode(s.ast, env)) }));
    } catch (e) { return fail('evaluation', e); }
    r.symbols.forEach(s => { s.value = Evaluator.format(env.get(s.name)); });
    r.stages.evaluation = 'success';
    r.output = r.results[r.results.length - 1].value;
    return r;
  }
  g.Compiler = { compile };
})(typeof window !== 'undefined' ? window : globalThis);
