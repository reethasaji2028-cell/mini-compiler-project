// Wires buttons to the compiler.
const EXAMPLES = [
  ['Precedence', '2 + 3 * 4'], ['Parentheses', '(2 + 3) * 4'], ['Left assoc', '100 / 10 / 2'], ['Unary', '-5 + 8'],
  ['Decimals', '12.5 + 2.5'], ['Variables', 'x = 4\ny = 6\nx + y * 2'],
  ['Bad syntax', '2 + * 3'], ['Missing )', '(2 + 3'], ['Bad char', '2 $ 3'], ['Undefined var', 'price * 2'], ['Divide by 0', '10 / 0']
];
UI.init(); UI.reset();
const src = UI.$('source');
UI.$('compile').onclick = () => UI.render(Compiler.compile(src.value));
UI.$('clear').onclick = () => { src.value = ''; UI.reset(); src.focus(); };
UI.$('example').onclick = () => { src.value = EXAMPLES[5][1]; UI.render(Compiler.compile(src.value)); };
EXAMPLES.forEach(([name, code]) => {
  const b = UI.el('button', 'ghost ex', name); b.title = code;
  b.onclick = () => { src.value = code; UI.render(Compiler.compile(code)); };
  UI.$('examples').appendChild(b);
});
src.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter') UI.$('compile').click(); });
