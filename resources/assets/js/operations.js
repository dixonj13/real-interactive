
export function projection(attributes, relation) {
    return relation.map(tuple => {
        var matches = {};
        attributes.forEach(key => {
            matches[key] = tuple[key];
        });
        return matches;
    });
}

export function selection(comparisons, relation) {
    return relation.tuples.filter(tuple => {

    });
}

function compare(stmt) {
    switch (stmt) {
        case '==': return stmt.lhs === stmt.rhs;
        case '!=': return stmt.lhs !== stmt.rhs;
        case '>' : return stmt.lhs > stmt.rhs;
        case '>=': return stmt.lhs >= stmt.rhs;
        case '<' : return stmt.lhs < stmt.rhs;
        case '<=': return stmt.lhs <= stmt.rhs;
        default:
            throw Error('Invalid comparison operation');
    }
}

