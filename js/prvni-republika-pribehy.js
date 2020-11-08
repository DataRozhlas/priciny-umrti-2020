import * as d3 from 'd3'
import * as d3Annotation from 'd3-svg-annotation'
import "intersection-observer";
import scrollama from "scrollama";
import times from 'lodash/times'
import debounce from 'lodash/debounce'

import { getCategoryId, getSvgElementId } from "./utilities.js"
import { setHighlightLine, setContextLine, setVisitedLine, setHighlightToAllLines, setContextToAllLines, setDarkToAllLines } from "./scroll-actions.js"
import { getCategoryColor } from './visualization_config.js';

// Extend d3 with the annotation library properties
Object.assign(d3, d3Annotation)

const initScrollama = ({ vizSvg, data1919MzStd, data1919MStd, data1919ZStd, vizSteps, viz }) => {
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

      if (direction === 'down' && vizSteps[stepNo] && vizSteps[stepNo].fromPrevious) {
        console.log(`Calling ${stepNo}.fromPrevious`)
        vizSteps[stepNo].fromPrevious({ vizSvg, viz, data1919MzStd, data1919MStd, data1919ZStd })
      }

      if (direction === 'up' && vizSteps[stepNo + 1] && vizSteps[stepNo + 1].backToPrevious) {
        console.log(`Calling ${stepNo + 1}.backToPrevious`)
        vizSteps[stepNo + 1].backToPrevious({ vizSvg, viz, data1919MzStd, data1919MStd, data1919ZStd })
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

const initViz = ({ vizSvg, data1919MzStd, data1919MStd, data1919ZStd }) => {
  // We want the parent div of the svg to get the available space
  const { width, height } = vizSvg.node().parentNode.getBoundingClientRect()

  const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')

  const svg = vizSvg.attr("viewBox", [0, 0, width, height]);

  // 1. Prepare data functions

  const years = data1919MzStd[0].data.map(d => d3.timeParse('%Y')(d.rok))

  const x = d3.scaleUtc()
    .domain(d3.extent(years))
    .range([vizMargin.left, width - vizMargin.right])

  const yTotal = d3.scaleLinear()
    .domain([0, d3.max(data1919MzStd.map(category => d3.max(category.data.map(d => (d.value))) ))])
    .nice()
    .range([height - vizMargin.bottom, vizMargin.top])

  const yCategories = d3.scaleLinear()
    .domain([0, d3.max(data1919MzStdWithoutTotal.map(category => d3.max(category.data.map(d => (d.value))) ))])
    .nice()
    .range([height - vizMargin.bottom, vizMargin.top])

  // 2. Axes

  const yAxis = g => g
    .attr("transform", `translate(${vizMargin.left},0)`)
    .call(d3.axisLeft(yTotal))
    // Remove the axis line to make the chart lighter
    .call(g => g.select(".domain").attr('stroke-width', 0))
    // .call(g => g.select(".domain").remove())
    // TODO: add label "standardizované úmrtí na 100 tis. obyv."
    // .call(g => g.select(".tick:last-of-type text").clone()
    //   .attr("x", 3)
    //   .attr("text-anchor", "start")
    //   .attr("font-weight", "bold")
    //   .text("Yo"))

  const xAxis = g => g
    .attr("transform", `translate(0,${height - vizMargin.bottom})`)
    .call(
      d3.axisBottom(x)
        .ticks(d3.timeYear.every(1))
        .tickSizeOuter(0)
        .tickFormat(d3.timeFormat('%Y'))
    )

  svg.append("g")
    .attr("class", "g-axis-x")
    .call(xAxis);

  svg.append("g")
    .attr("class", "g-axis-y")
    .call(yAxis);

  // 3. Lines

  const lineTotal = d3.line()
    .x(d => x(d3.timeParse('%Y')(d.rok)))
    .y(d => yTotal(d.value ? d.value : 0))

  const lineCategories = d3.line()
    .x(d => x(d3.timeParse('%Y')(d.rok)))
    .y(d => yCategories(d.value ? d.value : 0))

  const svgLinesG = svg.append("g")
    .attr("class", "g-lines")

  svgLinesG.selectAll("path.lines")
    // Display only the total line
    .data(data1919MzStd.filter(category => category.skupina === 'Celkem'))
    .enter()
    .append("path")
      .attr("id", category => getSvgElementId( "prvni-republika-pribehy-line", category.skupina ))
      .attr("class", "lines")
      .attr("d", category => lineTotal(category.data))
      .attr("stroke", getCategoryColor('celkem'))
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("fill", "none")
  
  // 4. Labels

  // const svgLabelsG = svg.append("g")
  //   .attr('class', 'g-labels')

  // svgLabelsG.selectAll('text')
  //   .data(data1919MzStdWithoutTotal)
  //   .enter()
  //   .append('text')
  //   .text(category => category.skupina)
  //   .attr('class', 'series-label')
  //   .attr("id", category => getSvgElementId("prvni-republika-pribehy-label", category.skupina))
  //   .attr('x', category => x(labelPosition[getCategoryId(category.skupina)].x))
  //   .attr('y', category => y(labelPosition[getCategoryId(category.skupina)].y))
  //   .style('fill', category => getCategoryColor(getCategoryId(category.skupina)))

  return {
    x,
    yTotal,
    yCategories,
    width,
    height,
    lineTotal,
    lineCategories,
    svgLinesG
  }
}

const vizSteps = {
  2: {
    fromPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      const { height, x, yTotal } = viz

      const svgXAxisAnnotationsG = vizSvg.append('g')
        .attr('class', 'g-xaxis-annotations')
        .lower()

      // First republic line

      const annotationFirstRepublicLine = d3.line()
        .x(() => x(d3.timeParse('%Y')(1919)))
        .y(d => yTotal(d))

      svgXAxisAnnotationsG.append('path')
        .attr('id', 'prvni-republika-pribehy-annotation-first-republic-line')
        .attr("d", annotationFirstRepublicLine([0, 2200]))
        .attr("stroke", '#cccccc')
        .attr("stroke-width", 1)
        .attr('stroke-dasharray', '4,4')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("fill", "none")

      // First republic label

      svgXAxisAnnotationsG.append('text')
        .attr('id', 'prvni-republika-pribehy-annotation-first-republic-label')
        .text('První republika')
        .attr('x', x(d3.timeParse('%Y')(1919)) + 10)
        .attr('y', yTotal(2200) + 25)
        .style('fill', '#aaaaaa')

      // 2WW band

      svgXAxisAnnotationsG.append('rect')
        .attr('id', 'prvni-republika-pribehy-annotation-2ww-rect')
        .attr('width', x(d3.timeParse('%Y')(1945)) - x(d3.timeParse('%Y')(1939)))
        .attr('height', yTotal(0) - yTotal(2200))
        .attr('x', x(d3.timeParse('%Y')(1939)))
        .attr('y', yTotal(2200))
        .style("fill", "#eee")
      
      // 2WW label

      svgXAxisAnnotationsG.append('text')
        .attr('id', 'prvni-republika-pribehy-annotation-2ww-label')
        .text('2. světová válka')
        .attr('x', x(d3.timeParse('%Y')(1939)) + 40)
        .attr('y', yTotal(2200) + 25)
        .style('fill', '#aaaaaa')
    },
    backToPrevious: ({ vizSvg }) => {
      // Remove annotations

      vizSvg.select('.g-xaxis-annotations')
        .remove()
    }
  },

  3: {
    fromPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      const { x, yCategories, lineTotal, lineCategories, svgLinesG } = viz

      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')
      const data1919MzStdCategoryTotal = data1919MzStd.find(category => category.skupina === 'Celkem')

      // 1. Instantly remove the original total line

      svgLinesG.select('#' + getSvgElementId( "prvni-republika-pribehy-line", 'Celkem'))
        .remove()

      // 2. Instantly add all the category lines with the data of total

      svgLinesG.selectAll("path.lines")
        .data(data1919MzStdWithoutTotal)
        .enter()
        .append("path")
          .attr("id", category => getSvgElementId( "prvni-republika-pribehy-line", category.skupina ))
          .attr('data-category-name', category => category.skupina)
          .attr("class", "lines")
          // We start by rendering all the lines using the category total data
          // so we can then "break" that line using animation into the category-lines
          .attr("d", () => lineTotal(data1919MzStdCategoryTotal.data))
          .attr("stroke", getCategoryColor('default'))
          .attr("stroke-width", 2)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("fill", "none")

      // 3. Animation part 1: "Break" the total line into category lines

      data1919MzStd
        .map(category => category.skupina)
        .filter(categoryName => categoryName !== 'Celkem')
        .forEach(categoryName => {
          vizSvg.select('#' + getSvgElementId( "prvni-republika-pribehy-line", categoryName))
            .transition()
            .duration(700)
            .attr("d", () => lineTotal(data1919MzStd.find(category => category.skupina === categoryName).data))
        })

      // 4. Animation part 2: Change the scale of Y axis and lines to match the categories

      const yAxis = g => g
        .attr("transform", `translate(${vizMargin.left},0)`)
        .call(d3.axisLeft(yCategories))

      vizSvg.select('.g-axis-y')
        .transition()
        .duration(700)
        .delay(700)
        .call(yAxis);

      data1919MzStdWithoutTotal
        .map(category => category.skupina)
        .filter(categoryName => categoryName !== 'Celkem')
        .forEach(categoryName => {
          vizSvg.select('#' + getSvgElementId( "prvni-republika-pribehy-line", categoryName))
            .transition()
            .duration(700)
            .delay(700)
            .attr("d", () => lineCategories(data1919MzStd.find(category => category.skupina === categoryName).data))
        })

      // 5. Move annotations below the axis

      const annotationFirstRepublicLine = d3.line()
        .x(() => x(d3.timeParse('%Y')(1919)))
        .y(d => yCategories(d))

      vizSvg.select('#prvni-republika-pribehy-annotation-first-republic-line')
        .transition()
        .duration(700)
        .delay(1400)
        .attr("d", annotationFirstRepublicLine([-40, 0]))

      vizSvg.select('#prvni-republika-pribehy-annotation-first-republic-label')
        .transition()
        .duration(700)
        .delay(1400)
        .attr('y', yCategories(0) + 40)

      vizSvg.select('#prvni-republika-pribehy-annotation-2ww-rect')
        .transition()
        .duration(700)
        .delay(1400)
        .attr('height', yCategories(-40) - yCategories(0))
        .attr('y', yCategories(0))

      vizSvg.select('#prvni-republika-pribehy-annotation-2ww-label')
        .transition()
        .duration(700)
        .delay(1400)
        .attr('y', yCategories(0) + 40)
      
    },
    backToPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      const { yTotal, lineTotal, svgLinesG } = viz

      const data1919MzStdCategoryTotal = data1919MzStd.find(category => category.skupina === 'Celkem')

      const yAxis = g => g
        .attr("transform", `translate(${vizMargin.left},0)`)
        .call(d3.axisLeft(yTotal))

      vizSvg.select('.g-axis-y')
        .transition()
        .duration(700)
        .call(yAxis);

      svgLinesG.selectAll("path.lines")
        .remove()

      svgLinesG.selectAll("path.lines")
        // Display only the total line
        .data([data1919MzStdCategoryTotal])
        .enter()
        .append("path")
          .attr("id", category => getSvgElementId( "prvni-republika-pribehy-line", category.skupina ))
          .attr("class", "lines")
          .attr("d", category => lineTotal(category.data))
          .attr("stroke", getCategoryColor('celkem'))
          .attr("stroke-width", 2)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("fill", "none")
    },
  },


  // 1: {
  //   stepDown: ({ vizSvg }) => {
  //     // const annotations = [
  //     //   {
  //     //     note: {
  //     //       label: 'Yo',
  //     //       title: 'Foo'
  //     //     },
  //     //     data: {
  //     //       x: data.timeParse('%Y')(1919)
  //     //     },
  //     //     subject: {
  //     //       y1: margin.top,
  //     //       y2: height - margin.bottom
  //     //     }
  //     //   }
  //     // ]

  //     // const makeAnnotations = d3.annotation()
  //     //   .type(d3.annotationXYThreshold)
  //     //   .annotations(annotations)

  //     // vizSvg.append('g')
  //     //   .attr('class', 'g-annotations')
  //     //   .call(makeAnnotations)
  //   }
  // },
  // 2: {
  //   stepDown: () => {

  //   }
  // },
  // 3: {
  //   stepDown: () => {

  //   }
  // }


  // 1: {
  //   stepDown: ({ vizSvg }) => {
  //     setContextToAllLines({ svg: vizSvg, svgClass: "lines"})
  //     setHighlightLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné" })
  //   }
  // },
  // 2: {
  //   stepUp: ({ vizSvg }) => {
  //     setDarkToAllLines({ svg: vizSvg, svgClass: "lines"})
  //   },
  //   stepDown: ({ vizSvg }) => {
  //     setHighlightLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního" })
  //   }
  // },
  // 3: {
  //   stepUp: ({ vizSvg }) => {
  //     setContextLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního" })
  //     setHighlightLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné" })
  //   },
  //   stepDown: ({ vizSvg }) => {
  //     setVisitedLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné"})
  //   }
  // }, 
  // 4: {
  //   stepUp: ({ vizSvg }) => {
  //     setHighlightLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné" })
  //   },
  //   stepDown: ({ vizSvg }) => {
  //     setVisitedLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního"})
  //     setHighlightLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
  //   }
  // },
  // 5: {
  //   stepUp: ({ vizSvg }) => {
  //     setHighlightLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního" })
  //     setContextLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
  //   },
  //   stepDown: ({ vizSvg }) => {
  //     setVisitedLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
  //     setHighlightLine({ svg: vizSvg, category: "válečné-akce-a-soudní-poprava" })
  //   }
  // }, 
  // 6: {
  //   stepUp: ({ vizSvg }) => {
  //     setHighlightLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })
  //     setContextLine({ svg: vizSvg, category: "válečné-akce-a-soudní-poprava" })
  //   },
  //   stepDown: ({ vizSvg }) => {
  //     setHighlightToAllLines({ svg: vizSvg, svgClass: "lines" })
  //   }
  // },
  // 7: {
  //   stepUp: ({ vizSvg }) => {
  //     setContextToAllLines({ svg: vizSvg, svgClass: "lines"})
  //     setHighlightLine({ svg: vizSvg, category: "válečné-akce-a-soudní-poprava" })
  //     setVisitedLine({ svg: vizSvg, category: "nemoci-nakažlivé-a-cizopasné"})
  //     setVisitedLine({ svg: vizSvg, category: "nemoci-ústrojí-oběhu-krevního"})
  //     setVisitedLine({ svg: vizSvg, category: "rakovina-a-jiné-nádory" })     
  //   },
  //   stepDown: ({ vizSvg }) => {

  //   }
  // },
      // X: {
      //   stepUp: ({ vizSvg }) => {
    
      //   },
      //   stepDown: ({ vizSvg }) => {
    
      //   }
      // },
};

// const CATEGORY_NAMES = {
//   INFEKCE: "nemoci-nakazlive-a-cizopasne",
//   SRDCE: "nemoci-ustroji-obehu-krevniho",
//   RAKOVINA: "rakovina-a-jine-nadory",
//   VALECNE_AKCE: "valecne-akce-a-soudni-poprava",
//   STARECKA_SESLOST: "starecka-seslost",
  
// }

const vizMargin = ({ top: 20, right: 30, bottom: 200, left: 40 })

const labelPosition = {
  "nemoci-nakazlive-a-cizopasne" : { x: 1927, y: 250 },
  "nemoci-ustroji-obehu-krevniho" : { x: 1929, y: 380 },
  "rakovina-a-jine-nadory" : { x: 1933, y: 220 },
  "valecne-akce-a-soudni-poprava" :  { x: 1935, y: 100 },
  "starecka-seslost" :  { x: 1923, y: 500 },
  "nemoci-ustroju-dychacich" :  { x: 1937, y: 150 },
  "nemoci-soustavy-nervove-a-smyslovych-ustroju" :  { x: 1921, y: 140 },
  "nemoci-ustroji-zazivaciho" :  { x: 1930, y: 75 },
  "sebevrazdy" :  { x: 1922, y: 42 },


  "neurcite-priciny-smrti" :  { x: 1920, y: -50 },
  "nemoci-rheumaticke-vyzivove-zlaz-s-vnitrnim-vymesovanim-jine-nemoci-celkove-a-avitaminos" : { x: 1920, y: -70 },
  "nemoci-krve-a-ustroju-krvetvornych" :  { x: 1920, y: -90 },
  "otravy-vlekle" :  { x: 1920, y: -110 },
  "nemoci-ustroji-mocoveho-a-pohlavniho" :  { x: 1930, y: -50 },
  "nemoci-kuze-a-vaziva-podkozniho" :  { x: 1930, y: -130 },
  "nemoci-kosti-a-ustroji-pohybu" :  { x: 1934, y: -90 },
  "vrozene-vady-vyvojove" :  { x: 1926, y: -110 },
  "zvlastni-nemoci-utleho-veku" :  { x: 1920, y: -130 },
  "vrazdy-a-zabiti" :  { x: 1920, y: -150 },
  "urazy-pri-doprave" :  { x: 1938, y: -130 },
  "urazy-a-otravy-mimo-dopravu" :  { x: 1938, y: -110 },
  "nemoci-tehotenstvi-porodu-a-stavu-poporodniho": { x: 1938, y: -110 }
}

;(() => {
  Promise.all([
    fetch('data/1919_mz_std.json').then(response => {
      return !response.error ? response.json() : Promise.reject()
    }),
    fetch('data/1919_m_std.json').then(response => {
      return !response.error ? response.json() : Promise.reject()
    }),
    fetch('data/1919_z_std.json').then(response => {
      return !response.error ? response.json() : Promise.reject()
    }),
  ]).then(([
    data1919MzStd,
    data1919MStd,
    data1919ZStd,
  ]) => {
    const vizSvg = d3.select("#prvni-republika-pribehy .viz")
    
    let viz = initViz({ vizSvg, data1919MzStd, data1919MStd, data1919ZStd });
    initScrollama({ vizSvg, data1919MzStd, data1919MStd, data1919ZStd, vizSteps, viz });

    const reinitVizAfterResize = () => {
      // Remove everything inside the svg element before reinitializing the viz
      vizSvg.selectAll("*").remove();
  
      viz = initViz({ vizSvg, data1919MzStd, data1919MStd, data1919ZStd });
    }
    const reinitVizAfterResizeDebounced = debounce(reinitVizAfterResize, 200)
  
    window.addEventListener('resize', reinitVizAfterResizeDebounced)
  })
})();
