/*
*    main.js
*/
d3.json('data/revenues.json').then((data) => {
    const revenues = [];
    const months = [];
    let maxRevenue = 0;
    let revenue = 0;
  
    data.forEach((d) => {
      revenue = parseInt(d.revenue);
      if (revenue > maxRevenue) {
        maxRevenue = revenue;
        revenues.push(revenue);
      }
      months.push(d.month);
    });
  
    const width = 700;
    const height = 500;
    const margin = { left: 100, right: 10, top: 10, bottom: 100 };
    const g = d3
      .select('#chart-area')
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    const x = d3.scaleBand().domain(months).range([0, width]);
    const y = d3.scaleLinear().domain([maxRevenue, 0]).range([0, height]);
    const bottomAxis = d3.axisBottom(x);
  
    g.append('g')
      .attr('class', 'bottom axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(bottomAxis)
      .selectAll('text')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-20)');
    g.append('text')
      .attr('class', 'y axis-label')
      .attr('x', -(height / 2))
      .attr('y', -60)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('font-weight', 'bold')
      .text('Revenue(dlls.)');
  
    const leftAxis = d3.axisLeft(y).tickFormat((d) => '$' + d / 1000 + ' k');
  
    g.append('g').attr('class', 'left axis').call(leftAxis).selectAll('text');
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 60)
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('Months');
  
    const gData = g.selectAll('gData').data(data);
    const rectWidth = width / data.length - 10;
  
    gData
      .enter()
      .append('rect')
      .attr('width', () => rectWidth)
      .attr('height', (d) => height - y(parseInt(d.revenue)))
      .attr('x', (d) => x(d.month) + width / data.length / 2 - rectWidth / 2)
      .attr('y', (d) => y(parseInt(d.revenue)))
      .style('fill', '#ff8303');
  });