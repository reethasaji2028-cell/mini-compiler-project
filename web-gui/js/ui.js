// UI renderer: draws a compile result into the page. Uses textContent only (no innerHTML with user data).
(function (g) {
  const $ = id => document.getElementById(id);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
  const STAGES = [['lexical', 'Lexical Analysis'], ['syntax', 'Syntax Analysis'], ['ast', 'AST Generation'], ['semantic', 'Semantic Analysis'], ['evaluation', 'Evaluation']];

  function treeList(node, label) {
    const ul = el('ul'), li = el('li');
    const l = label(node); li.appendChild(el('span', 'n' + (node.children.length ? '' : ' l'), l));
    node.children.forEach(c => li.appendChild(treeList(c, label)));
    ul.appendChild(li); return ul;
  }
  function row(tbody, cells) { const tr = el('tr'); cells.forEach(c => tr.appendChild(el('td', '', String(c)))); tbody.appendChild(tr); }

  function reset() { render(null); }
  function render(r) {
    const stages = r ? r.stages : {};
    $('pipeline').replaceChildren(...STAGES.map(([k, name]) => {
      const s = stages[k] || 'pending', d = el('div', 'stage ' + s); d.append(el('strong', '', name), el('small', '', s)); return d;
    }));
    const st = $('status');
    const failed = r && Object.values(r.stages).includes('failed'), ok = r && r.stages.evaluation === 'success';
    st.textContent = ok ? 'Compiled successfully' : failed ? 'Compilation failed' : 'Ready';
    st.className = 'badge ' + (ok ? 'success' : failed ? 'failed' : '');

    const tb = $('tokens').tBodies[0]; tb.replaceChildren();
    (r ? r.tokens : []).forEach((t, i) => row(tb, [i + 1, t.type, t.lexeme, `${t.line}:${t.col}`]));

    $('parsetree').replaceChildren(); $('asttree').replaceChildren();
    if (r && r.stages.syntax === 'success') r.statements.forEach(s => {
      $('parsetree').append(el('h3', '', 'Line ' + s.line), treeList(s.pt, n => n.lexeme ? `${n.name} "${n.lexeme}"` : n.name));
      $('asttree').append(el('h3', '', 'Line ' + s.line), treeList(AST.toDisplay(s.ast), n => n.label));
    });
    if (r && !$('parsetree').childNodes.length) {
      const m = el('span', 'muted', 'Not generated (earlier stage failed).'); $('parsetree').append(m); $('asttree').append(m.cloneNode(true));
    }

    const sem = $('semantic'); sem.replaceChildren();
    if (r && r.stages.semantic === 'success') r.info.forEach(m => sem.appendChild(el('li', '', m)));
    else sem.appendChild(el('li', '', r && r.stages.semantic === 'failed' ? 'Semantic error — see Error Details.' : 'Pending.'));
    const sb = $('symbols').tBodies[0]; sb.replaceChildren();
    (r ? r.symbols : []).forEach(s => row(sb, [s.name, s.type, s.value === null ? '—' : s.value, s.line, s.uses]));

    const out = $('output'), errs = $('errors'); errs.replaceChildren();
    if (!r) { out.textContent = '—'; out.className = 'out'; errs.textContent = 'No errors.'; return; }
    if (ok) { out.textContent = r.output; out.className = 'out'; errs.textContent = 'No errors.'; }
    else {
      out.textContent = r.errors[0].message; out.className = 'out err';
      r.errors.forEach(e => {
        const b = el('div', 'err-box'); b.append(el('b', '', e.stage.toUpperCase() + ' ERROR'), el('div', '', `${e.message} (line ${e.line}, column ${e.col})`), el('div', 'muted', e.hint || ''));
        errs.appendChild(b);
      });
    }
  }
  function init() {
    $('grammar').textContent = Grammar.productions.join('\n') + '\n\n' + Grammar.notes.map(n => '• ' + n).join('\n');
  }
  g.UI = { render, reset, init, el, $ };
})(typeof window !== 'undefined' ? window : globalThis);
