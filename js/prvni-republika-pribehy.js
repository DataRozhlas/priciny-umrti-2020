import * as d3 from 'd3'
import "intersection-observer";
import scrollama from "scrollama";

const initScrollama = ({ vizSvg, vizSteps }) => {
  // instantiate the scrollama
  const scroller = scrollama({ debug: true, offset: 0.5 });

  // setup the instance, pass callback functions
  scroller
    .setup({
      step: "#prvni-republika-pribehy .step",
    })
    .onStepEnter(({ direction, index }) => {
      console.log('onStepEnter', { direction, index })

      if (direction === 'down' && vizSteps[index - 1] && vizSteps[index - 1].stepDown) {
        vizSteps[index - 1].stepDown({ vizSvg })
      }

      if (direction === 'up' && vizSteps[index + 1] && vizSteps[index + 1].stepUp) {
        vizSteps[index + 1].stepUp({ vizSvg })
      }
    })
    .onStepExit(({ direction, index }) => {
      console.log('onStepExit', { direction, index })
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

const vizSteps = {
  0: {
    stepDown: ({ vizSvg }) => {
      vizSvg
        .selectAll("path")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke", "red")
    }
  },
  1: {
    stepUp: ({ vizSvg }) => {
      vizSvg
        .selectAll("path")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke", "steelblue")
    },
    stepDown: ({ vizSvg }) => {
      vizSvg
        .selectAll("path")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke", "green")
    }
  },
  2: {
    stepUp: ({ vizSvg }) => {
      vizSvg
        .selectAll("path")
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("stroke", "red")
    }
  }
};

(() => {
  const vizSvg = d3.select("#prvni-republika-pribehy .viz")
  initViz({ vizSvg });
  initScrollama({ vizSvg, vizSteps });  
})();

