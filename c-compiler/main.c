/*
 * Mini compiler entry point.
 * Member 2: lexical analyzer; Member 3: parser; Member 4: AST and semantics.
 */
#include <stdio.h>
#include <string.h>
#include "lexer.h"
#include "parser.h"
#include "ast.h"

int main(void)
{
    printf("====================================\n");
    printf("  ARITHMETIC EXPRESSION MINI COMPILER\n");
    printf("====================================\n");
    printf("Enter an expression: ");

    if (fgets(input, sizeof(input), stdin) == NULL)
        return 1;
    input[strcspn(input, "\n")] = '\0';

    if (!parse_expression()) {
        printf("\nCompilation stopped: syntax analysis failed.\n");
        return 1;
    }

    printf("\nSyntax analysis passed.\n");
    printf("\nABSTRACT SYNTAX TREE (AST)\n");
    printf("--------------------------\n");
    ast_print(get_ast_root(), 0);

    printf("\nSEMANTIC CHECKS\n");
    printf("----------------\n");
    if (!ast_semantic_check(get_ast_root())) {
        printf("Compilation stopped: semantic analysis failed.\n");
        return 1;
    }

    printf("\nCompilation front-end completed successfully.\n");
    return 0;
}
