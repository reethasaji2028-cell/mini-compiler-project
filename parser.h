#ifndef PARSER_H
#define PARSER_H

#include "ast.h"

/* Returns 1 if the complete expression is syntactically valid, otherwise 0. */
int parse_expression(void);

/* Returns the AST produced by the most recent successful parse. */
ASTNode *get_ast_root(void);

#endif
