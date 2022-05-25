/*
*    main.js
*/

d3.json('data/buildings.json').then((data) => {
    const size = 500;
    var svg = d3
      .select('#chart-area')
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      ;
    const width = 30;
    const buildings = svg.selectAll().data(data);
    let buildingsName = [];
    data.forEach(({ name }) => {
      buildingsName.push(name);
    });
    const x = d3
      .scaleBand()
      .domain(buildingsName)
      .range([0, 400])
      .paddingInner(0.3)
      .paddingOuter(0.3);
  
    const y = d3.scaleLinear().domain([0, 828]).range([0, 400]);
    const color = d3
      .scaleOrdinal()
      .domain(buildingsName)
      .range(d3.schemeSet3.filter((_, index) => index < buildingsName.length));
    buildings
      .enter()
      .append('rect')
      .attr('width', (d, i) => width)
      .attr('height', (d) => y(d.height))
      .attr('fill', (d, i) => color(d.name))
      .attr('x', (d) => x(d.name))
      .attr('y', (d) => size - y(d.height));
  });