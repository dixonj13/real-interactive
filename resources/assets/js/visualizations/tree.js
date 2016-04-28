var d3 = require('d3');

import * as table from './table';

export function update(root, target, onClick) {
  
    var margin = {top: 30, right: 10, bottom: 30, left: 10};
    var width = 500 - margin.left - margin.right;
    var height = (85 * getDepth(root)) - margin.top - margin.bottom;

    var orientation = {
        size: [width, height],
        x: function(d) { return d.x; },
        y: function(d) { return height - d.y; }
    };

    var svg = d3.select(target)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var o = orientation;
    var tree = d3.layout.tree().size(o.size);
    var nodes = tree.nodes(root);
    var links = tree.links(nodes);

    svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "Tree__link")
        .attr("d", d3.svg.diagonal().projection(d => { 
            return [ o.x(d), o.y(d) ]; 
        }));

    var node = svg.selectAll(".node")
        .data(nodes);
  
    var nodeEnter = node.enter().append("g")
        .attr("class", "Tree__node")
        .on("click", click);
  
    nodeEnter.append("circle")
        .attr("r", d => { return (d.children) ? 15 : 8; })
        .attr("cx", o.x)
        .attr("cy", o.y);
  
    nodeEnter.append("text")
        .attr("class", "Tree__text")
        .attr("y", d => { return (d.children) ? o.y(d) + 4 : o.y(d) - 14; })
        .attr("x", d => { return o.x(d); })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; });
    
    function click(d) {
        onClick(d.relation);
    }
  
}

function getDepth(obj) {
    var depth = 0;
    if (obj.children) {
        obj.children.forEach(function (d) {
            var tmpDepth = getDepth(d);
            if (tmpDepth > depth)
                depth = tmpDepth;
        });
    }
    return 1 + depth;
}
