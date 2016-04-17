
export function projection(attributes, relation) {
    return relation.tuples.map(tuple => {
        var result = {};
        attributes.map(attr => { result[attr] = (tuple[attr]) ? tuple[attr] : null; });
        return result;
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