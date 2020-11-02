import * as d3 from 'd3'
import "intersection-observer";
import scrollama from "scrollama";
import data_1919_men from "../data/1919-1948_m_std_clean.js"
import { getSvgElementId } from "./utilities.js"
import { setHighlightLine, setContextLine, setVisitedLine, setHighlightToAllLines, setContextToAllLines } from "./scroll-actions.js"


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

const initViz = ({ vizSvg, data, axes }) => {
  const width = 500;
  const height = 500
  const margin = ({ top: 20, right: 30, bottom: 30, left: 40 })

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
    .call(d3.axisBottom(x).ticks(width / 60).tickSizeOuter(0))

  const x = d3.scaleLinear()
    .domain(d3.extent(axes.x))
    .range([margin.left, width - margin.right])

  // const max = d3.max(data.map(category => d3.max(category.data.map(d => (d.Std_umrti))) ))
  const y = d3.scaleLinear()
    .domain([0, d3.max(data.map(category => d3.max(category.data.map(d => (d.Std_umrti))) ))]).nice()
    .range([height - margin.bottom, margin.top])

  const line = d3.line()
    .x(d => x(d.Rok))
    .y(d => y(d.Std_umrti))

  const svg = vizSvg.attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  // svg
  const lines = svg.selectAll("path.lines")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "lines")
    .attr("id", d => getSvgElementId( "line", d.category ))
    .attr("d", d => line(d.data) )
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("fill", "none")
    
}

const vizSteps = {
  0: {
    stepDown: ({ vizSvg }) => {
      setContextToAllLines({ svg: vizSvg, svgClass: "lines"})
      setHighlightLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné" })
    }
  },
  1: {
    stepUp: ({ vizSvg }) => {
      setHighlightToAllLines({ svg: vizSvg, svgClass: "lines"})
    },
    stepDown: ({ vizSvg }) => {
      setHighlightLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního" })
    }
  },
  2: {
    stepUp: ({ vizSvg }) => {
      setContextLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního" })
      setHighlightLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné" })
    },
    stepDown: ({ vizSvg }) => {
      setVisitedLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné"})
    }
  }, 
  3: {
    stepUp: ({ vizSvg }) => {
      setHighlightLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné" })
    },
    stepDown: ({ vizSvg }) => {
      setVisitedLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního"})
      setHighlightLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
    }
  },
  4: {
    stepUp: ({ vizSvg }) => {
      setHighlightLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního" })
      setContextLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
    },
    stepDown: ({ vizSvg }) => {
      setVisitedLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
      setHighlightLine({ svg: vizSvg, category: "válečné-akce-a-soudní-poprava" })
    }
  }, 
  5: {
    stepUp: ({ vizSvg }) => {
      setHighlightLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
      setContextLine({ svg: vizSvg, category: "válečné-akce-a-soudní-poprava" })
    },
    stepDown: ({ vizSvg }) => {

    }
  },
  // X: {
  //   stepUp: ({ vizSvg }) => {

  //   },
  //   stepDown: ({ vizSvg }) => {

  //   }
  // },
};

(() => {

  const categories = new Set(data_1919_men.map(d => d.Skupina))
  const years = new Set(data_1919_men.map(d => d.Rok))
  let dataByCat = [];

  categories.forEach(c => {
    dataByCat.push({ 
        category: c,
        data: data_1919_men.filter(d => d.Skupina === c)
      }
    )
  })

  const vizSvg = d3.select("#prvni-republika-pribehy .viz")
  initViz({ vizSvg, data : dataByCat, axes: {x: years} });
  initScrollama({ vizSvg, vizSteps });  
})();