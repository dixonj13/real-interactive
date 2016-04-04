/**
 * parser grammar ll(1)
 *
 * current operations:
 * project
 * select
 * rename
 * set union
 * set difference
 * cartesian product
 */

EXPR        ::= 'ρ' name RENAME0 SETOP
              | 'π' ATTRIBUTES0 '(' EXPR ')' SETOP
              | 'σ' PREDICATE '(' EXPR ')' SETOP
              | name SETOP

SETOP       ::= '∪' EXPR
              | '−' EXPR
              | ''
              | ϵ

RENAME0     ::= '(' RENAME1

RENAME1     ::= name RENAME2
              | 'ρ' name RENAME0 SETOP ')'
              | 'π' ATTRIBUTES0 '(' EXPR ')' SETOP ')'
              | 'σ' PREDICATE '(' EXPR ')' SETOP ')'

RENAME2     ::= ',' name RENAME3 ')' '(' EXPR ')'
              | ')' RENAME4

RENAME3     ::= ',' name RENAME3
              | ϵ

RENAME4     ::= '(' EXPR ')'
              | ϵ

ATTRIBUTES0 ::= ATTRIBUTE ATTRIBUTES1

ATTRIBUTES1 ::= ',' ATTRIBUTE ATTRIBUTES1
              | ϵ

ATTRIBUTE   ::= name QUALIFIER

QUALIFIER   ::= '.' name
              | ϵ

PREDICATE   ::= TERM DISJUNCTION

DISJUNCTION ::= '∨' TERM DISJUNCTION
              | ϵ

TERM        ::= FACTOR CONJUNCTION

CONJUNCTION ::= '∧' FACTOR CONJUNCTION
              | ϵ

FACTOR      ::= '¬' '(' PREDICATE ')'
              | '(' PREDICATE ')'
              | COMPARISON

COMPARISON  ::= ATTRIBUTE COMPAREOP COMPARABLE

COMPARABLE  ::= ATTRIBUTE
              | string
              | number

COMPAREOP   ::= '<' | '≤' | '=' | '≠' | '≥' | '>'