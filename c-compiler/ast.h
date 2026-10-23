#ifndef AST_H
#define AST_H

typedef enum {
    AST_NUMBER,
    AST_IDENTIFIER,
    AST_OPERATOR
} ASTNodeType;

typedef struct ASTNode {
    ASTNodeType type;
    char value[100];
    struct ASTNode *left;
    struct ASTNode *right;
} ASTNode;

ASTNode *ast_create_number(const char *value);
ASTNode *ast_create_identifier(const char *name);
ASTNode *ast_create_operator(const char *op, ASTNode *left, ASTNode *right);
void ast_print(const ASTNode *root, int depth);
int ast_semantic_check(const ASTNode *root);
void ast_free(ASTNode *root);

#endif
