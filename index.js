const svg = d3.select('#one');

// + to parse as numerical instead of string
const height = +svg.attr('height');
const width = +svg.attr('width');

const render = data => {

  // variables
  const xValue = d => d.date
  const yValue = d => d.price
  const margin = { top:20, right:20, bottom:80, left:90 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const dollarFormat = d => d3.format('($,.0f')(d.price);
  const dollarFormatComp = d => d3.format('($,.0f')(d.price_comp);

  // x scale values computed using the nominal values
  const xScale = d3.scaleBand()
      .domain(data.map(xValue))
      .range([0, innerWidth])
      .padding(0.2);

  // y scale values computed using the quantitative values
  const yScale = d3.scaleLinear()
      .domain([40000, d3.max(data, d => yValue(d)+2000)])
      .range([innerHeight, 0]);

  // container that sets up the margins
  const g = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // Y axis format
  g.append('g').call(d3.axisLeft(yScale)
      .tickFormat(d3.format('($,.0f')));

    // Y axis label
  g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", - margin.left)
      .attr("x", 0 - (innerHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Price (USD)");

    // X axis format
  g.append('g').call(d3.axisBottom(xScale))
      .attr('transform', 'translate(' + 0 + ',' + innerHeight + ')')
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.5em')
      .attr('dy', '-.25em')
      .attr('transform', 'rotate(-90)');

    // X axis label
  g.append('text')
      .attr("transform", "translate(" + (innerWidth/2) + " ," + (margin.bottom + innerHeight) + ")")
      .style("text-anchor", "middle")
      .text("Dates");


  // create all rectangles
  g.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(xValue(d)))
      .attr('width', xScale.bandwidth)
      .attr('height', 0)
      .attr('y', d => innerHeight)
      .on('mouseover', function(d) {
          div.transition()
              .duration(200)
              .style('opacity', .9);
          div.html('Price: '  + dollarFormat(d) + '</br>Compared to </br> launch price: ' + dollarFormatComp(d))
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on("mouseout", function() {
          div.transition()
              .duration(500)
              .style('opacity', 0);
      });

    // tooltip
    const div = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

  g.selectAll('rect')
      .transition()
      .duration(1000)
      .attr('height', d => innerHeight - yScale(yValue(d)))
      .attr('y', d => yScale(yValue(d)));

    // Annotations on the graph
    //lines
    g.append('line')
        .transition()
        .delay(750)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("x1", 309)
        .attr("y1", 104)
        .attr("x2", 330)
        .attr("y2", 75);

    g.append('line')
        .transition()
        .delay(750)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("x1", 165)
        .attr("y1", 15)
        .attr("x2", 385)
        .attr("y2", 150);

    // Annotations
    g.append('text')
        .transition()
        .delay(750)
        .attr('x', "335" )
        .attr('y', "65")
        .text('Price dropped $8,000');

    g.append('text')
        .transition()
        .delay(750)
        .attr('x', "335" )
        .attr('y', "90")
        .text('from Oct/18 to mid Mar/19');

};

// load csv data and parse as numerical value
d3.csv('data.csv').then(data => {
    data.forEach(d => {
        d.price = +d.price;
        d.price_comp = +d.price_comp;
    });
    render(data);
});
