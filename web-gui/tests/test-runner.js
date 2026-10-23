// Run with:  node tests/test-runner.js
['lexer', 'grammar', 'ast', 'parser', 'semantic', 'evaluator', 'compiler'].forEach(m => require('../js/' + m + '.js'));

// [name, source, expected value]  or  [name, source, {stage, msg}] for expected failures
const T = [
  ['add', '2 + 3', 5], ['precedence', '2 + 3 * 4', 14], ['parentheses', '(2 + 3) * 4', 20],
  ['div assoc', '100 / 10 / 2', 5], ['sub assoc', '10 - 3 - 2', 5], ['unary', '-5 + 8', 3],
  ['decimal', '12.5 + 2.5', 15], ['decimal 0.75', '0.75 * 4', 3], ['double unary', '--5', 5],
  ['unary mixed', '3 - -2', 5], ['unary plus', '+4 * 2', 8], ['nested parens', '((1 + 2) * (3 + 4))', 21],
  ['mixed', '2 * 3 + 4 * 5 - 6 / 2', 23], ['spaces', '   7   *   6  ', 42],
  ['variables', 'x = 4\ny = 6\nx + y * 2', 16], ['reassign', 'x = 1\nx = x + 5\nx * 2', 12],
  ['assignment value', 'a = 3 * 3', 9], ['multi-char ident', 'total = 10\nprice = 2.5\ntotal * price', 25],
  ['2 + * 3', '2 + * 3', { stage: 'syntax' }], ['trailing op', '5 +', { stage: 'syntax' }],
  ['missing )', '(2 + 3', { stage: 'syntax', msg: "Missing ')'" }], ['extra )', '2 + 3)', { stage: 'syntax', msg: 'Unmatched' }],
  ['empty parens', '()', { stage: 'syntax' }], ['empty input', '   ', { stage: 'lexical', msg: 'Empty' }],
  ['invalid char', '2 $ 3', { stage: 'lexical', msg: "'$'" }], ['implicit mult', '2(3 + 4)', { stage: 'syntax' }],
  ['missing operator', '2 3', { stage: 'syntax' }], ['leading *', '* 3', { stage: 'syntax' }],
  ['bad assignment', '4 = x', { stage: 'syntax' }], ['undefined var', 'x + 1', { stage: 'semantic', msg: "'x'" }],
  ['self-use before define', 'x = x + 1', { stage: 'semantic' }], ['div by zero', '10 / 0', { stage: 'evaluation', msg: 'zero' }],
  ['div by zero expr', '5 / (3 - 3)', { stage: 'evaluation' }]
];

let pass = 0;
T.forEach(([name, src, exp]) => {
  const r = Compiler.compile(src);
  let ok, got;
  if (typeof exp === 'number') { ok = r.output === exp && r.errors.length === 0; got = r.output; }
  else {
    const e = r.errors[0];
    ok = !!e && e.stage === exp.stage && r.stages[exp.stage] === 'failed' && (!exp.msg || e.message.includes(exp.msg)) && r.output === null;
    got = e ? `${e.stage}: ${e.message}` : 'no error';
  }
  if (ok) pass++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  (${JSON.stringify(src)}) -> ${got}`);
});
// Structural check: AST must reflect precedence.
const a = Compiler.compile('2 + 3 * 4').statements[0].ast;
const astOk = a.type === 'Binary' && a.op === '+' && a.right.op === '*';
console.log(`${astOk ? 'PASS' : 'FAIL'}  AST shape for 2 + 3 * 4`); if (astOk) pass++;
console.log(`\n${pass}/${T.length + 1} tests passed`);
process.exit(pass === T.length + 1 ? 0 : 1);
