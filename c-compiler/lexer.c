/*
 * MEMBER 2: LEXICAL ANALYZER
 * Adapted from Member 2's lexicalanalyser.c.
 * The interactive main() was moved to main.c so the lexer can be
 * called by the parser and the complete compiler can have one entry point.
 */
#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include "lexer.h"

char input[MAX];
int pos = 0;

const char *token_name(TokenType type)
{
    switch (type) {
        case TOK_ID:      return "IDENTIFIER";
        case TOK_NUM:     return "NUMBER";
        case TOK_PLUS:    return "PLUS";
        case TOK_MINUS:   return "MINUS";
        case TOK_MUL:     return "MULTIPLY";
        case TOK_DIV:     return "DIVIDE";
        case TOK_LPAREN:  return "LEFT_PAREN";
        case TOK_RPAREN:  return "RIGHT_PAREN";
        case TOK_INVALID: return "INVALID";
        case TOK_END:     return "END";
        default:          return "UNKNOWN";
    }
}

Token next_token(void)
{
    Token t;
    int start, len, dot = 0;

    while (isspace((unsigned char)input[pos]))
        pos++;

    t.position = pos;
    t.lexeme[0] = '\0';

    if (input[pos] == '\0') {
        t.type = TOK_END;
        strcpy(t.lexeme, "END");
        return t;
    }

    start = pos;

    if (isalpha((unsigned char)input[pos]) || input[pos] == '_') {
        while (isalnum((unsigned char)input[pos]) || input[pos] == '_')
            pos++;
        t.type = TOK_ID;
    } else if (isdigit((unsigned char)input[pos]) ||
               (input[pos] == '.' && isdigit((unsigned char)input[pos + 1]))) {
        while (isdigit((unsigned char)input[pos]) || input[pos] == '.') {
            if (input[pos] == '.') {
                if (dot) {
                    pos++;
                    t.type = TOK_INVALID;
                    goto save_lexeme;
                }
                dot = 1;
            }
            pos++;
        }
        t.type = TOK_NUM;
    } else {
        switch (input[pos]) {
            case '+': t.type = TOK_PLUS; break;
            case '-': t.type = TOK_MINUS; break;
            case '*': t.type = TOK_MUL; break;
            case '/': t.type = TOK_DIV; break;
            case '(': t.type = TOK_LPAREN; break;
            case ')': t.type = TOK_RPAREN; break;
            default:  t.type = TOK_INVALID; break;
        }
        pos++;
    }

save_lexeme:
    len = pos - start;
    if (len >= (int)sizeof(t.lexeme))
        len = (int)sizeof(t.lexeme) - 1;
    strncpy(t.lexeme, input + start, (size_t)len);
    t.lexeme[len] = '\0';
    return t;
}
