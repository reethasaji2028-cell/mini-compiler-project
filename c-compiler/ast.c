/*
 * MEMBER 4: ABSTRACT SYNTAX TREE (AST) AND SEMANTIC CHECKS
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include "ast.h"

static ASTNode *ast_create(ASTNodeType type, const char *value,
                           ASTNode *left, ASTNode *right)
{
    ASTNode *node = (ASTNode *)malloc(sizeof(ASTNode));
    if (node == NULL) {
        fprintf(stderr, "Error: memory allocation failed while creating AST.\n");
        exit(EXIT_FAILURE);
    }

    node->type = type;
    strncpy(node->value, value, sizeof(node->value) - 1);
    node->value[sizeof(node->value) - 1] = '\0';
    node->left = left;
    node->right = right;
    return node;
}

ASTNode *ast_create_number(const char *value)
{
    return ast_create(AST_NUMBER, value, NULL, NULL);
}

ASTNode *ast_create_identifier(const char *name)
{
    return ast_create(AST_IDENTIFIER, name, NULL, NULL);
}

ASTNode *ast_create_operator(const char *op, ASTNode *left, ASTNode *right)
{
    return ast_create(AST_OPERATOR, op, left, right);
}

void ast_print(const ASTNode *root, int depth)
{
    int i;
    if (root == NULL)
        return;

    for (i = 0; i < depth; i++)
        printf("  ");

    if (root->type == AST_NUMBER)
        printf("NUMBER: %s\n", root->value);
    else if (root->type == AST_IDENTIFIER)
        printf("IDENTIFIER: %s\n", root->value);
    else
        printf("OPERATOR: %s\n", root->value);

    /* Print left child before right child to make the tree easy to follow. */
    if (root->left != NULL)
        ast_print(root->left, depth + 1);
    if (root->right != NULL)
        ast_print(root->right, depth + 1);
}

static int is_valid_identifier(const char *name)
{
    size_t i;

    if (name == NULL || name[0] == '\0')
        return 0;

    if (!(isalpha((unsigned char)name[0]) || name[0] == '_'))
        return 0;

    for (i = 1; name[i] != '\0'; i++) {
        if (!(isalnum((unsigned char)name[i]) || name[i] == '_'))
            return 0;
    }
    return 1;
}

static int is_literal_zero(const ASTNode *node)
{
    char *end;
    double value;

    if (node == NULL || node->type != AST_NUMBER)
        return 0;

    value = strtod(node->value, &end);
    return end != node->value && *end == '\0' && value == 0.0;
}

static int check_node(const ASTNode *node)
{
    int errors = 0;

    if (node == NULL)
        return 0;

    if (node->type == AST_IDENTIFIER && !is_valid_identifier(node->value)) {
        printf("Semantic error: invalid identifier '%s'.\n", node->value);
        errors++;
    }

    if (node->type == AST_OPERATOR &&
        strcmp(node->value, "/") == 0 &&
        is_literal_zero(node->right)) {
        printf("Semantic error: division by literal zero is not allowed.\n");
        errors++;
    }

    errors += check_node(node->left);
    errors += check_node(node->right);
    return errors;
}

int ast_semantic_check(const ASTNode *root)
{
    int errors = check_node(root);

    if (errors == 0)
        printf("Semantic checks passed.\n");
    else
        printf("Semantic checks found %d error(s).\n", errors);

    return errors == 0;
}

void ast_free(ASTNode *root)
{
    if (root == NULL)
        return;
    ast_free(root->left);
    ast_free(root->right);
    free(root);
}
