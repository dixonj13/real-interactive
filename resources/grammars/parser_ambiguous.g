/**
 * Left-recursive ambiguous grammar to account for
 * the left-associativity requirements.
 * 
 * Although the grammar is not LL(1) and is ambiguous,
 * by implementing left-recursion through loops where
 * each loop always continues as long as possible, 
 * picking a particular production, the parser can
 * become deterministic. [1] The grammar also maintains
 * the ability to choose the next production rule 
 * based on one lookahead token. 
 *
 * Syntactic notes: 
 * {x} means x may be repeated zero or more times
 * [x] means x is optional
 * (x|y) means choose x or y
 *
 * [1] http://www.engr.mun.ca/~theo/Misc/exp_parsing.htm#classic
 */

UNIONISECT  -> DIFFERENCE {("union"|"intersection") DIFFERENCE}
DIFFERENCE  -> JOIN {"difference" JOIN}
JOIN        -> CPRODUCT {"join" CPRODUCT}
CPRODUCT    -> RELATION {"cproduct" RELATION}
RELATION    -> "projection" ATTRIBUTES "(" UNIONISECT ")"
             | "selection" DISJUNCTION "(" UNIONISECT ")"
             | "rename" id ["[" ATTRIBUTES "]"] "(" UNIONISECT ")"
             | "(" UNIONISECT ")"
             | relation
ATTRIBUTES  -> ATTRIBUTE {"," ATTRIBUTES}
ATTRIBUTE   -> id [QUALIFIED]
QUALIFIED   -> "." id
DISJUNCTION -> CONJUNCTION {"or" CONJUNCTION}
CONJUNCTION -> OPERAND {"and" OPERAND}
OPERAND     -> "not" "(" DISJUNCTION ")"
             | "(" DISJUNCTION ")"
             | COMPARISON
COMPARISON  -> ATTRIBUTE compare_op COMPARABLE
COMPARABLE  -> ATTRIBUTE
             | NUMBER
             | string
NUMBER      -> ["-"] number
