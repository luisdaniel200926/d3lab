/*
*    main.js
*/

const svgSize = 400;
var svg = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', svgSize)
  .attr('height', svgSize)
  .style('background-color', 'white');
d3.json('data/ages.json')
  .then((data) => {
    data.forEach((d) => {
      d.age = +d.age;
    });
    let currPos = 0;
    let circles = svg.selectAll().data(data);
    circles
      .enter()
      .append('circle')
      .attr('cy', svgSize / 2)
      .attr('cx', (d) => {
        currPos += (d.age + 5) * 4;
        return currPos;
      })
      .attr('r', (d) => d.age * 2.5)
      .attr('fill', (d) => (d.age > 10 ? 'red' : 'blue'));
  })
  .catch((error) => {
    console.log(error);
  });