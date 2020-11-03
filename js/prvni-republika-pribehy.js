import * as d3 from 'd3'
import "intersection-observer";
import scrollama from "scrollama";
import times from 'lodash/times'
import debounce from 'lodash/debounce'

import data_1919_men from "../data/1919-1948_m_std_clean.js"
import { getKebabCase, getSvgElementId } from "./utilities.js"
import { setHighlightLine, setContextLine, setVisitedLine, setHighlightToAllLines, setContextToAllLines, setDarkToAllLines } from "./scroll-actions.js"
import { getCategoryColor, labelPosition } from './visualization_config.js';


const initScrollama = ({ vizSvg, vizSteps }) => {
  const scroller = scrollama();

  scroller
    .setup({
      // debug: true,
      offset: 0.15,
      step: "#prvni-republika-pribehy .step",
    })
    .onStepEnter(({ element, direction, index }) => {
      const stepNo = parseInt(element.dataset.step, 10)

      // console.log('onStepEnter', { direction, stepNo })

      if (direction === 'down' && vizSteps[stepNo - 1] && vizSteps[stepNo - 1].stepDown) {
        console.log(`Calling ${stepNo - 1}.stepDown`)
        vizSteps[stepNo - 1].stepDown({ vizSvg })
      }

      if (direction === 'up' && vizSteps[stepNo + 1] && vizSteps[stepNo + 1].stepUp) {
        console.log(`Calling ${stepNo + 1}.stepUp`)
        vizSteps[stepNo + 1].stepUp({ vizSvg })
      }

      element.classList.add('is-active')

      document.querySelectorAll('#prvni-republika-pribehy .dots .dot').forEach(dotElement => {
        dotElement.classList.remove('is-active')
      })

      const dotElement = document.querySelector(`#prvni-republika-pribehy .dots .dot-step-${stepNo}`)
      if (dotElement) {
        dotElement.classList.add('is-active') 
      }
    })
    .onStepExit(({ element, direction, index }) => {
      const stepNo = parseInt(element.dataset.step, 10)

      // console.log('onStepExit', { direction, stepNo })

      element.classList.remove('is-active')
    });

  window.addEventListener("resize", scroller.resize);

  const onDotClick = (stepNo) => {
    const stepElements = document.querySelectorAll('#prvni-republika-pribehy .step')
    stepElements.forEach(stepElement => {
      if (stepElement.dataset.step === String(stepNo)) {
        stepElement.scrollIntoView()
      }
    })
  }

  // Create dots
  const stepsCount = document.querySelectorAll('#prvni-republika-pribehy .step').length
  const dotsElement = document.querySelector('#prvni-republika-pribehy .dots')
  times(stepsCount, index => {
    const stepNo = index + 1

    const dotButton = document.createElement('button');
    dotButton.classList.add('dot')
    dotButton.classList.add(`dot-step-${stepNo}`)
    if (stepNo === 1) {
      dotButton.classList.add('is-active')
    }
    dotButton.addEventListener('click', e => onDotClick(stepNo))

    dotsElement.append(dotButton)
  })
}

const initViz = ({ vizSvg, data, axes }) => {
  const { width, height } = vizSvg.node().parentNode.getBoundingClientRect()

  const margin = ({ top: 20, right: 30, bottom: 200, left: 40 })

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
  const lines = svg.append("g").attr("class", "g-lines")
  lines.selectAll("path.lines")
    .data(data)
    .enter()
    .append("path")
      .attr("id", d => getSvgElementId( "line", d.category ))
      .attr("class", "lines")
      .attr("d", d => line(d.data) )
      .attr("stroke", getCategoryColor("default"))
      .attr("stroke-width", 1)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("fill", "none")
      .append('p')
      .text("Hello")
  
  const labels = svg.append("g").attr('class', 'g-labels')
  // const labels = d3.select('#prvni-republika-pribehy').append("div").attr('class', 'div-labels')
  labels.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(d => d.category)
    .attr('class', 'series-label')
    .attr("id", d => getSvgElementId( "text", d.category ))
    .attr('x', d => x(labelPosition[getKebabCase(d.category)].x ))
    .attr('y', d => y(labelPosition[getKebabCase(d.category)].y ))
    .style('fill', d => getCategoryColor(getKebabCase(d.category)))
}

const vizSteps = {
  1: {
    stepDown: ({ vizSvg }) => {
      setContextToAllLines({ svg: vizSvg, svgClass: "lines"})
      setHighlightLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné" })
    }
  },
  2: {
    stepUp: ({ vizSvg }) => {
      setDarkToAllLines({ svg: vizSvg, svgClass: "lines"})
    },
    stepDown: ({ vizSvg }) => {
      setHighlightLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního" })
    }
  },
  3: {
    stepUp: ({ vizSvg }) => {
      setContextLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního" })
      setHighlightLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné" })
    },
    stepDown: ({ vizSvg }) => {
      setVisitedLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné"})
    }
  }, 
  4: {
    stepUp: ({ vizSvg }) => {
      setHighlightLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné" })
    },
    stepDown: ({ vizSvg }) => {
      setVisitedLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního"})
      setHighlightLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
    }
  },
  5: {
    stepUp: ({ vizSvg }) => {
      setHighlightLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního" })
      setContextLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
    },
    stepDown: ({ vizSvg }) => {
      setVisitedLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
      setHighlightLine({ svg: vizSvg, category: "válečné-akce-a-soudní-poprava" })
    }
  }, 
  6: {
    stepUp: ({ vizSvg }) => {
      setHighlightLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
      setContextLine({ svg: vizSvg, category: "válečné-akce-a-soudní-poprava" })
    },
    stepDown: ({ vizSvg }) => {
      setHighlightToAllLines({ svg: vizSvg, svgClass: "lines" })
    }
  },
  7: {
    stepUp: ({ vizSvg }) => {
      setContextToAllLines({ svg: vizSvg, svgClass: "lines"})
      setHighlightLine({ svg: vizSvg, category: "válečné-akce-a-soudní-poprava" })
      setVisitedLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné"})
      setVisitedLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního"})
      setVisitedLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })     
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

  initViz({ vizSvg, data: dataByCat, axes: { x: years } });
  initScrollama({ vizSvg, vizSteps });

  const reinitVizAfterResize = () => {
    console.log('yo')
    // Remove everything inside the svg element before reinitializing the viz
    vizSvg.selectAll("*").remove();

    initViz({ vizSvg, data: dataByCat, axes: { x: years } });
  }
  const reinitVizAfterResizeDebounced = debounce(reinitVizAfterResize, 200)

  window.addEventListener('resize', reinitVizAfterResizeDebounced)
})();
