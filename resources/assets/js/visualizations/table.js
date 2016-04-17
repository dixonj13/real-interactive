var d3 = require('d3');

export function update(name, attributes, tuples, element) {

    var container = d3.select(element)
        .append('div')
        .attr('class', 'Real__table-container');

    var table = container.append('div')
        .attr('class', 'Real__table');

    table.append('div')
        .attr('class', 'Real__table-name-container')
            .append('div')
                .text(name)
                .attr('class', 'Real__table-name');

    var table_row = table.append('div')
        .attr('class', 'Real__table-row');
    
    var relation = table_row.append('table')
        .attr('class', 'Real__relation');
    var thead = relation.append('thead')
        .attr('class', 'Real__relation-header');
    var tbody = relation.append('tbody')
        .attr('class', 'Real__relation-body');

    thead.append('tr')
        .attr('class', 'Real__attributes')
        .selectAll('th')
        .data(attributes)
        .enter()
            .append('th')
            .text(attribute => { return attribute; })
            .attr('class', 'Real__attribute');

    var rows = tbody.selectAll('tr')
        .data(tuples)
        .enter()
            .append('tr')
            .attr('class', 'Real__tuple');

    rows.selectAll('td')
        .data(tuple => {
            return attributes.map(attribute => {
                return (tuple[attribute]) ? tuple[attribute] : '[null]';
            });
        })
        .enter()
            .append('td')
            .html(value => { return value; })
            .attr('class', 'Real__value');
}
