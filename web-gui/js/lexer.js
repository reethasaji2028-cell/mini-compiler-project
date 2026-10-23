// Lexical analyzer: turns one line of source text into tokens.
(function (g) {
  const SINGLE = { '+': 'PLUS', '-': 'MINUS', '*': 'MUL', '/': 'DIV', '(': 'LPAREN', ')': 'RPAREN', '=': 'ASSIGN' };
  const isDigit = c => c >= '0' && c <= '9';
  const isAlpha = c => /[A-Za-z_]/.test(c);
  function tokenize(src, lineNo) {
    const tokens = [], errors = [];
    let i = 0;
    const add = (type, lexeme, start) => tokens.push({ type, lexeme, line: lineNo, col: start + 1 });
    while (i < src.length) {
      const c = src[i];
      if (c === ' ' || c === '\t') { i++; continue; }          // ignore whitespace
      if (SINGLE[c]) { add(SINGLE[c], c, i); i++; continue; }
      if (isDigit(c)) {                                          // integer or decimal
        const s = i;
        while (isDigit(src[i])) i++;
        if (src[i] === '.' && isDigit(src[i + 1])) { i++; while (isDigit(src[i])) i++; }
        add('NUMBER', src.slice(s, i), s); continue;
      }
      if (isAlpha(c)) {                                          // identifier
        const s = i;
        while (i < src.length && (isAlpha(src[i]) || isDigit(src[i]))) i++;
        add('IDENTIFIER', src.slice(s, i), s); continue;
      }
      errors.push({ message: `Invalid character '${c}'`, line: lineNo, col: i + 1,
        hint: 'Allowed: + - * / ( ) =, numbers like 12.5, and identifiers (letters, digits, _).' });
      i++;
    }
    tokens.push({ type: 'EOF', lexeme: '', line: lineNo, col: src.length + 1 });
    return { tokens, errors };
  }
  g.Lexer = { tokenize };
})(typeof window !== 'undefined' ? window : globalThis);
