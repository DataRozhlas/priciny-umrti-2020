import * as d3 from 'd3'
import "intersection-observer";
import scrollama from "scrollama";

const initScrollama = ({ vizSvg }) => {
  // instantiate the scrollama
  const scroller = scrollama({ debug: true, offset: 0.5 });

  // setup the instance, pass callback functions
  scroller
    .setup({
      step: "#prvni-republika-pribehy .step",
    })
    .onStepEnter(({ index }) => {
      console.log('onStepEnter', { index })

      if (index === 1) {
        vizSvg
          .selectAll("path")
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr("stroke", "red")
      }
    })
    .onStepExit(({ index }) => {
      console.log('onStepExit', { index })
    });

  // setup resize event
  window.addEventListener("resize", scroller.resize);
}

const initViz = ({ vizSvg }) => {
  const width = 500;
  const height = 500
  const margin = ({ top: 20, right: 30, bottom: 30, left: 40 })

  const data = [
    {
      year: '1919',
      value: 100
    },
    {
      year: '1920',
      value: 110
    },
    {
      year: '1921',
      value: 120
    }
  ];

  const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y))

  const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.year))
    .range([margin.left, width - margin.right])

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top])

  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.value))

  const svg = vizSvg.attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);
}

(() => {
  const vizSvg = d3.select("#prvni-republika-pribehy .viz")
  initViz({ vizSvg });
  initScrollama({ vizSvg });  
})();








// // set the dimensions and margins of the graph
// var margin = {top: 10, right: 30, bottom: 30, left: 60},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#prvni-republika-pribehy")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// //Read the data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

//   // When reading the csv, I must format variables:
//   function(d){
//     return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
//   },

//   // Now I can use this dataset:
//   function(data) {

//     // Add X axis --> it is a date format
//     var x = d3.scaleTime()
//       .domain(d3.extent(data, function(d) { return d.date; }))
//       .range([ 0, width ]);
//     svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//     // Add Y axis
//     var y = d3.scaleLinear()
//       .domain([0, d3.max(data, function(d) { return +d.value; })])
//       .range([ height, 0 ]);
//     svg.append("g")
//       .call(d3.axisLeft(y));

//     // Add the line
//     svg.append("path")
//       .datum(data)
//       .attr("fill", "none")
//       .attr("stroke", "steelblue")
//       .attr("stroke-width", 1.5)
//       .attr("d", d3.line()
//         .x(function(d) { return x(d.date) })
//         .y(function(d) { return y(d.value) })
//         )

// })
