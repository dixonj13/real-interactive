
export var Visitor = function() {

    this.visit = {

        RELATION: function(node) {
            return { name: node.getNodeValue(), relation: node.relation };
        },

        PROJECT: function(node) {
            return { 
                name: 'π', 
                relation: node.relation, 
                children: [ node.children[1].visit(this) ]
            };
        },

        SELECT: function(node) {
            return { 
                name: 'σ', 
                relation: node.relation, 
                children: [ node.children[1].visit(this) ]
            };
        },

        RENAME: function(node) {
            var child = (node.children[2]) ?
                node.children[2].visit(this) : node.children[1].visit(this);
            return { 
                name: 'ρ', 
                relation: node.relation, 
                children: [ child ]
            };
        },

        UNION: function(node) {
            return { 
                name: '∪', 
                relation: node.relation,
                children: [
                    node.children[0].visit(this),
                    node.children[1].visit(this)
                ]
            };
        },

        ISECT: function(node) {
            return { 
                name: '∩', 
                relation: node.relation,
                children: [
                    node.children[0].visit(this),
                    node.children[1].visit(this)
                ]
            };
        },

        DIFF: function(node) {
            return { 
                name: '−', 
                relation: node.relation,
                children: [
                    node.children[0].visit(this),
                    node.children[1].visit(this)
                ]
            };
        },

        CPROD: function(node) {
            return { 
                name: '×', 
                relation: node.relation,
                children: [
                    node.children[0].visit(this),
                    node.children[1].visit(this)
                ]
            };
        },

        NJOIN: function(node) {
            return { 
                name: '⨝', 
                relation: node.relation,
                children: [
                    node.children[0].visit(this),
                    node.children[1].visit(this)
                ]
            };
        },

    };
};
