/*
*    main.js
*/
d3.json('data/buildings.json').then((data) => {
  const width = 600;
  const height = 400;
  const margin = { left: 100, right: 10, top: 10, bottom: 100 };

  const g = d3
    .select('#chart-area')
    .append('svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

  let heights = [];
  let names = [];
  let maxHeight = 0;
  data.forEach((element) => {
    names.push(element.name);
    heights.push(Number(element.height));
    if (Number(element.height) > maxHeight) {
      maxHeight = Number(element.height);
    }
  });
  var x = d3.scaleBand().domain(names).range([0, width]).paddingInner(0.1);
  var y = d3.scaleLinear().domain([0, maxHeight]).range([height, 0]);
  var rectsHeight = d3.scaleLinear().domain([0, maxHeight]).range([0, height]);
  var rects = g.selectAll('rect').data(data);
  rects
    .enter()
    .append('rect')
    .attr('height', (_, index) => rectsHeight(heights[index]))
    .attr('width', () => width / names.length)
    .attr('x', (d) => x(d.name))
    .attr('y', (_, index) => height - rectsHeight(heights[index]))
    .style('fill', 'grey');

  var bottomAxis = d3.axisBottom(x).ticks(5);
  g.append('g')
    .attr('class', 'bottom axis')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(bottomAxis)
    .selectAll('text')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-20)');

  var leftAxis = d3
    .axisLeft(y)
    .tickFormat((d) => d + ' m')
    .ticks(5);
  g.append('g').attr('class', 'left axis').call(leftAxis);

  g.append('text')
    .attr('class', 'y axis-label')
    .attr('x', -(height / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .style('fill', 'black')
    .text('Height (m)');

  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 95)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .style('fill', 'black')
    .text("The word's tallest buildings");
});