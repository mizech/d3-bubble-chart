const setupChart = (numb = 0) => {
    d3.selectAll("svg").remove();
    const svg = d3.select("#chart_root")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("background", "#efefef")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(`./csv/data${numb}.csv`, function(data) {
        var x = d3.scaleLinear()
            .domain([0, 45000])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(3));

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + 50)
            .text("Pro-Kopf-Einkommen");

        var y = d3.scaleLinear()
            .domain([35, 90])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", 0)
            .attr("y", -20)
            .text("Lebenserwartung")
            .attr("text-anchor", "start")

        var z = d3.scaleSqrt()
            .domain([200000, 1310000000])
            .range([2, 30]);

        var showTooltip = function(d) {
            tooltip
                .transition()
                .duration(200)
            tooltip
                .style("opacity", 1)
                .html("Land: " + d.land)
                .style("font-weight", "bold")
                .style("left", (d3.mouse(this)[0] + 30) + "px")
                .style("top", (d3.mouse(this)[1] + 30) + "px")
        }
        var hideTooltip = function(d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
        }

        const colors = ["#f00", "#00f", "#f0f", "#f5a",
            "#faf", "#aff", "#5a5", "#a5a",
            "#5aa", "#fa5"
        ];
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return x(d.gdpPercap);
            })
            .attr("cy", function(d) {
                return y(d.lifeExp);
            })
            .attr("r", function(d) {
                return z(d.pop);
            })
            .style("fill", function(d, i) {
                return colors[i];
            })
            .on("mouseover", showTooltip)
            .on("mouseleave", hideTooltip)
    })
};
const margin = {
    top: 40,
    right: 150,
    bottom: 60,
    left: 30
};
const width = 750 - margin.left - margin.right;
const height = 630 - margin.top - margin.bottom;

const slider = document.getElementById("slider");
slider.style.width = `${width}px`;
slider.style.marginLeft = `${margin.left}px`;
slider.addEventListener("change", (elem) => {
    setupChart(elem.target.value);
});

var tooltip = d3.select("#chart_root")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "lightgrey")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")
setupChart();