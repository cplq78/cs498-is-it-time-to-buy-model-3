const svg = d3.select('#four');

// + to parse as numerical instead of string
const height = +svg.attr('height');
const width = +svg.attr('width');

const render = data => {

  // variables
  const xValue = d => d.date
  const yValue = d => d.total
  const margin = { top:20, right:20, bottom:80, left:90 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const dollarPrice = d => d3.format('($,.0f')(d.price);
  const dollarSelfDrive = d => d3.format('($,.0f')(d.self_driving);
  const dollarTotal = d => d3.format('($,.0f')(d.total);
  const dollarTotalComp = d => d3.format('($,.0f')(d.total_comp);

  // x scale values computed using the nominal 'date' values
  const xScale = d3.scaleBand()
      .domain(data.map(xValue))
      .range([0, innerWidth])
      .padding(0.2);

  // y scale values computed using the quantitative 'price' values
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
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("<b>Total: "+ dollarTotal(d) + '</b>'+ "<br/> Car: "  + dollarPrice(d) + "<br/> Autopilot: " + dollarSelfDrive(d) + "</br>Compared to </br> launch price: " + dollarTotalComp(d))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // tooltip
    const div = d3.select('body').append('div')
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
        .attr("x1", 835)
        .attr("y1", 140)
        .attr("x2", 815)
        .attr("y2", 90);

    // Annotations
    g.append('text')
        .transition()
        .delay(750)
        .attr('x', "730" )
        .attr('y', "55")
        .text("Aug 1st 2020");

    g.append('text')
        .transition()
        .delay(750)
        .attr('x', "700" )
        .attr('y', "80")
        .text("Overall Cost: $54,990");

};

// load csv data and parse as numerical value
d3.csv('data.csv').then(data => {
    data.forEach(d => {
        d.total = +d.total;
        d.self_driving = +d.self_driving;
        d.price = +d.price;
        d.total_comp = +d.total_comp;
    });
    render(data);
});