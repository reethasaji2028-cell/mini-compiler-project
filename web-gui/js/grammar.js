// Grammar shown in the GUI (same productions the recursive-descent parser implements).
(function (g) {
  g.Grammar = {
    productions: [
      'Statement → IDENTIFIER = Expr | Expr',
      'Expr      → Term ExprTail',
      'ExprTail  → + Term ExprTail | - Term ExprTail | ε',
      'Term      → Unary TermTail',
      'TermTail  → * Unary TermTail | / Unary TermTail | ε',
      'Unary     → + Unary | - Unary | Primary',
      'Primary   → NUMBER | IDENTIFIER | ( Expr )'
    ],
    notes: [
      'Already free of left recursion, so no transformation is needed.',
      'Statement uses 2-token lookahead (IDENTIFIER then =) to choose assignment.',
      'ExprTail/TermTail loops build left-associative trees.'
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
