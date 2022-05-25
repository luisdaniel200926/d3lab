const margin = { left: 100, right: 10, top: 10, bottom: 100 };
const width = 700;
const height = 500;
var flag = true;
const g = d3
  .select('#chart-area')
  .append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
const xAxisGroup = g
  .append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, ' + height + ')');
const yAxisGroup = g.append('g').attr('class', 'y axis');
g.append('text')
  .attr('x', width / 2)
  .attr('y', height + 60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('font-weight', 'bold')
  .text('Months');
const yLabel = g
  .append('text')
  .attr('class', 'y axis-label')
  .attr('x', -(height / 2))
  .attr('y', -60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .attr('font-weight', 'bold')
  .text('Revenue');

const x = d3.scaleBand().range([0, width]).padding(0.2);
const y = d3.scaleLinear().range([height, 0]);
const xAxisCall = d3.axisBottom(x);
const yAxisCall = d3.axisLeft(y);

d3.json('data/revenues.json')
  .then((data) => {
    data.forEach((d) => {
      d.revenue = +d.revenue;
      d.profit = +d.profit;
    });
    d3.interval(() => {
      var newData = flag ? data : data.slice(1);
      update(newData);
      flag = !flag;
    }, 1000);
    update(data);
  })
  .catch((error) => {
    console.log(error);
  });

function update(data) {
  const value = flag ? 'revenue' : 'profit';
  x.domain(data.map((d) => d.month));
  y.domain([0, d3.max(data, (d) => d[value])]);
  xAxisGroup.call(xAxisCall);
  yAxisGroup.call(yAxisCall);
  const bars = g.selectAll('rect').data(data, (d) => d.month);
  bars.exit().remove();
  bars
    .attr('x', (d) => x(d.month))
    .attr('y', (d) => y(d[value]))
    .attr('width', x.bandwidth)
    .attr('height', (d) => height - y(d[value]));
  bars
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.month))
    .attr('y', (d) => y(d[value]))
    .attr('width', x.bandwidth)
    .attr('height', (d) => height - y(d[value]))
    .style('fill', '#ff8303');
  const label = flag ? 'Revenue' : 'Profit';
  yLabel.text(label);
}