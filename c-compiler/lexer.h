#ifndef LEXER_H
#define LEXER_H

#define MAX 512

typedef enum {
    TOK_ID,
    TOK_NUM,
    TOK_PLUS,
    TOK_MINUS,
    TOK_MUL,
    TOK_DIV,
    TOK_LPAREN,
    TOK_RPAREN,
    TOK_INVALID,
    TOK_END
} TokenType;

typedef struct {
    TokenType type;
    char lexeme[100];
    int position;
} Token;

extern char input[MAX];
extern int pos;

const char *token_name(TokenType type);
Token next_token(void);

#endif
