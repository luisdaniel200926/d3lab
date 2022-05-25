/*
*    main.js
*/

d3.json("data/data.json").then(function(data){
	console.log(data);
})
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

// Axis positons
const xAxisGroup = g
  .append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, ' + height + ')');
const yAxisGroup = g.append('g').attr('class', 'y axis');

// Axis labels
g.append('text')
  .attr('x', width / 2)
  .attr('y', height + 60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('font-weight', 'bold')
  .text('GDP Per Capita ($)');
g.append('text')
  .attr('x', -(height / 2))
  .attr('y', -60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .attr('font-weight', 'bold')
  .text('Life Expectancy (Years)');
const yearLabel = g
  .append('text')
  .attr('x', width - 25 * 2)
  .attr('y', height - 20)
  .attr('font-size', '25px')
  .attr('text-anchor', 'right')
  .text('0000');

const x = d3.scaleLog().range([0, width]).base(10);
x.domain([142, 150000]);
const y = d3.scaleLinear().range([height, 0]);
y.domain([0, 90]);
const area = d3.scaleLinear().range([25 * Math.PI, 1500 * Math.PI]);
area.domain([200, 1400000000]);
const colors = d3.scaleOrdinal().range(d3.schemePastel1);

const xAxisCall = d3
  .axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat((d) => '$' + d);
const yAxisCall = d3.axisLeft(y);

xAxisGroup.call(xAxisCall);
yAxisGroup.call(yAxisCall);

const t = d3.transition().duration(1000);
d3.json('data/data.json')
  .then((data) => {
    const years = data.map((year) => +year['year']);
    const formattedData = data.map((year) =>
      year['countries']
        .filter((country) => country.income && country.life_exp)
        .map((country) => {
          country.income = +country.income;
          country.life_exp = +country.life_exp;
          return country;
        })
    );
    const continents = [];
    formattedData[0].forEach(
      (country) =>
        !continents.some((continent) => continent == country.continent) &&
        continents.push(country.continent)
    );
    colors.domain(continents);
    const rectSize = 15;
    const legendGroup = g
      .append('g')
      .style('transform', `translate(${width - rectSize}px, ${height - 70}px)`);
    continents.forEach((continent, index) => {
      const countryGroup = legendGroup
        .append('g')
        .style('transform', `translate(0px, ${-20 * index}px)`);
      countryGroup
        .append('text')
        .attr('font-size', '15px')
        .attr('text-anchor', 'end')
        .attr('x', -5)
        .attr('y', 12)
        .style('text-transform', 'capitalize')
        .text(continent);
      countryGroup
        .append('rect')
        .attr('width', rectSize)
        .attr('height', rectSize)
        .style('fill', colors(continent));
    });
    const stepsPerSecond = 10;
    let index = 0;
    d3.interval(() => {
      update(
        formattedData[index % formattedData.length],
        years[index % years.length]
      );
      index += stepsPerSecond;
    }, 1000);
    update(
      formattedData[index % formattedData.length],
      years[index % years.length]
    );
    index += stepsPerSecond;
  })
  .catch((error) => {
    console.log(error);
  });

function update(data, year) {
  yearLabel.text(year);
  const circles = g.selectAll('circle').data(data, (d) => d.country);
  circles
    .exit()
    .transition(t)
    .attr('cx', (d) => x(d.income))
    .attr('cy', (d) => y(d.life_exp))
    .attr('r', (d) => Math.sqrt(area(d.population) / Math.PI))
    .remove();
  circles
    .transition(t)
    .attr('cx', (d) => x(d.income))
    .attr('cy', (d) => y(d.life_exp))
    .attr('r', (d) => Math.sqrt(area(d.population) / Math.PI));
  circles
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.income))
    .attr('cy', (d) => y(d.life_exp))
    .attr('r', (d) => Math.sqrt(area(d.population) / Math.PI))
    .style('fill', (d) => colors(d.continent))
    .merge(circles)
    .transition(t)
    .attr('cx', (d) => x(d.income))
    .attr('cy', (d) => y(d.life_exp))
    .attr('r', (d) => Math.sqrt(area(d.population) / Math.PI));
}