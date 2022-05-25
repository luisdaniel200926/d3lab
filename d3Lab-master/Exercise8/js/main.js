// Config
// ******
const margin = {top: 30, right: 40, bottom: 75, left: 75}
const width = 800, height = 370

const g = d3.select("#chart-area")
	.append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

/* Scales:
	x: Income
	y: Age Expectancy
	area: Population
	color: Country
*/
const x_scale = d3.scaleLog().domain([142, 150000]).range([0, width]).base(10)
const y_scale = d3.scaleLinear().domain([90, 0]).range([0, height])
const area_scale = d3.scaleLinear().domain([2000, 1400000000]).range([25*Math.PI, 1500*Math.PI])
const continents = ["africa", "americas", "asia", "europe"]
const color_scale = d3.scaleOrdinal().domain(continents).range(d3.schemeSet3)

/* Axis & Labels */
const y_axis = g.append("g").attr("class", "y axis")
const x_axis = g.append("g").attr("class", "x axis").attr("transform", "translate(0, " + height + ")")

const y_label = g.append("text")
	.attr("class", "y axis-label")
	.attr("x", - (height / 2))
	.attr("y", -45)
	.attr("font-size", "15px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")

const x_label =	g.append("text")
	.attr("class", "x axis-label")
	.attr("x", (width / 2) - 70)
	.attr("y", height + 60)
	.attr("font-size", "15px")

const year_label = g.append("text")
	.attr("class", "x axis-label")
	.attr("x", width - 130)
	.attr("y", height - 20)
	.attr("font-size", "55px")

/* Legend */
const legend = g.append("g")
	.attr("transform", "translate(" + (width - 10) + "," + (height - 125) + ")")

continents.forEach((continent, i) => {
	const legendRow = legend.append("g").attr("transform", "translate(-15, " + ((i * 20)-30) + ")")
	legendRow.append("rect")
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", color_scale(continent))
	legendRow.append("text")
	  .attr("class", "legend")
		.attr("x", -10)
		.attr("y", 10)
		.attr("text-anchor", "end")
		.style("text-transform", "capitalize")
		.text(continent)
})

/* Tooltip */
let t = 750, time = 190, len, interval, gdata
const tip = d3.tip().attr('class', 'd3-tip').html(d => {
	let text = "Country: " + d.country + "<br>"
	text += "Continent: " + "<span style='color:white;text-transform:capitalize'>" + d.continent + "</span><br>"
	text += "Life Expectancy: " + parseInt(d.life_exp) + "<br>"
	text += "GDP Per Capita: " + d3.format("$,.0f")(d.income) + "<br>"
	text += "Population: " + d3.format(",.0f")(d.population) + "<br>"
	return text
})
g.call(tip)

/* Slider */
$("#date-slider").slider({
	animate: "slow",
	max: 2014, min: 1800, step: 1,
	orientation: "horizontal",
	slide:(event, ui) => {
		time = ui.value - 1800
		update(gdata[time].countries, gdata[time].year)
	}
})

/* Filter By Country */
$("#continent-select").change(() => {
	update(gdata[time].countries, gdata[time].year)
})

/* Stop/Pause Interval On Click */
$("#play-button").click(( ) => {
	let button = $("#play-button")

	if (button.text() == "Play") {
		button.text("Pause")
		interval = setInterval(step, 100)
	} else {
		button.text("Play")
		clearInterval(interval)
	}

})

/* Reset On Click */
$("#reset-button").click(( ) => {
	time = 0
	update(gdata[time].countries, gdata[time].year)
})

// Obtain Data
// ***********
d3.json("https://raw.githubusercontent.com/gcastillo56/d3Lab/master/projects/leaf_project/data/data.json").then(data => {
  gdata = parse(data)
	len = gdata.length-2
	update(gdata[time].countries, gdata[time].year)
}).catch(error => print(error))

// Step
// ****
function step() {
	time = (time > len ? 0 : time + 1)
	update(gdata[time].countries, gdata[time].year)
}

// Update Data
// ***********
function update(data, year) {

	// Filter
	const filter = $("#continent-select").val()
	data = data.filter(d => {
		if (filter == "all") { return true }
		else return d.continent == filter
	})

	// Join
	circle = g.selectAll("circle").data(data, d => d.country)
	// Exit
	circle.exit().remove()
	// Enter & Update
	circle.enter().append("circle")
		.attr("cx", d => x_scale(d.income))
		.attr("cy", d => y_scale(d.life_exp))
		.attr("r", d => Math.sqrt(area_scale(0) / Math.PI))
		.attr("fill", d => color_scale(d.continent))
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide)
		.merge(circle)
		.transition(t)
			.attr("cx", d => x_scale(d.income))
			.attr("cy", d => y_scale(d.life_exp))
			.attr("r", d => Math.sqrt(area_scale(d.population) / Math.PI))

	configAxisAndLabels(x_scale, y_scale, "#fff", "Life Expectancy (Years)", "GDP Per Capita ($)", year)

}

// Config Axis & Labels
// *********************
function configAxisAndLabels(x, y, color, yLabel, xLabel, yearLabel) {

	// Y Axis
	const yAxis = d3.axisLeft(y)
	y_axis.transition(t).call(yAxis).selectAll("text").style("fill", color)

	// X Axis
	const xAxis = d3.axisBottom(x).tickValues([400, 4000, 40000]).tickFormat(d => "$" + d)
	x_axis.call(xAxis).selectAll("text").style("fill", color)
		.attr("y", "10").attr("x", "-5")
		.attr("text-anchor", "end")
		.attr("transform", "rotate(-45)")

	// Axis Color
	g.selectAll(".y.axis line").style("stroke", color)
	g.selectAll(".y.axis path").style("stroke", color)
	g.selectAll(".x.axis line").style("stroke", color)
	g.selectAll(".x.axis path").style("stroke", color)

	// Labels
	y_label.text(yLabel).style("fill", color)
	x_label.text(xLabel).style("fill", color)
	year_label.text(yearLabel).style("fill", color).style("fill-opacity", "0.5")
	$("#year").text(yearLabel)
	$("#date-slider").slider("value", +yearLabel)

	// Legend
	g.selectAll(".legend").style("fill", color)

}

// Parse Integers
// **************
function parse(data) {
	data = data.map(item => {
		return {
			countries: item.countries
				 .filter(country => country.income && country.life_exp)
				 .map(country => {
						country.income = +country.income
						country.life_exp = +country.life_exp
						return country
				 }),
		  year: item.year
		}
	})
  return data
}