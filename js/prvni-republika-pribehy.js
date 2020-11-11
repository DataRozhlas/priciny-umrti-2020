import * as d3 from 'd3'
import "intersection-observer";
import scrollama from "scrollama";
import times from 'lodash/times'
import debounce from 'lodash/debounce'
import kebabCase from 'lodash/kebabCase'

const initScrollama = ({ vizSvg, data1919MzStd, data1919MStd, data1919ZStd, vizSteps, viz }) => {
  const scroller = scrollama();

  scroller
    .setup({
      // debug: true,
      offset: 0.2,
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

  return {
    destroy: () => {
      window.removeEventListener("resize", scroller.resize);    
      scroller.destroy()
      dotsElement.selectAll('*').remove()
    }
  }
}

const initViz = ({ vizSvg, data1919MzStd, data1919MStd, data1919ZStd }) => {
  // We want the parent div of the svg to get the available space
  const { width, height } = vizSvg.node().parentNode.getBoundingClientRect()

  vizSvg.attr("viewBox", [0, 0, width, height]);

  const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')

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

  const xAxis = g => g
    .attr("transform", `translate(0,${height - vizMargin.bottom})`)
    .call(
      d3.axisBottom(x)
        .ticks(d3.timeYear.every(1))
        .tickSizeOuter(0)
        .tickFormat(d3.timeFormat('%Y'))
    )

  vizSvg.append("g")
    .attr("class", "g-axis-x")
    .call(xAxis);

  vizSvg.append("g")
    .attr("class", "g-axis-y")
    .call(yAxis);

  const svgAxesLabelsG = vizSvg.append("g")
    .attr("class", "g-axes-labels")

  const axisXLabel = svgAxesLabelsG.append('text')
    .attr('class', 'axis-x-label')
    .attr('y', vizMargin.top - 35)
    .attr('text-anchor', 'end')

  axisXLabel.append('tspan').text('Std.').attr('x', vizMargin.left - 8)
  axisXLabel.append('tspan').text('úmrtnost').attr('dy', 12).attr('x', vizMargin.left - 8)

  // 3. Lines

  const lineTotal = d3.line()
    .x(d => x(d3.timeParse('%Y')(d.rok)))
    .y(d => yTotal(d.value ? d.value : 0))

  const lineCategories = d3.line()
    .x(d => x(d3.timeParse('%Y')(d.rok)))
    .y(d => yCategories(d.value ? d.value : 0))

  vizSvg.append("g")
    .attr("class", "g-lines")
  
  const totalCategory = data1919MzStd.find(category => category.skupina === 'Celkem')

  addCategoryLine({
    vizSvg, 
    categoryName: 'Celkem',
    d: lineTotal(totalCategory.data),
    style: 'active',
    activeColor: categoryColorsActive['Celkem']
  })
  
  // 4. Labels

  vizSvg.append("g")
    .attr('class', 'g-line-labels')

  addCategoryLineLabel({
    vizSvg,
    categoryName: 'Celkem',
    position: {
      x: x(categoryLineLabelPositions['Celkem'].x),
      y: yTotal(categoryLineLabelPositions['Celkem'].y),
      textAnchor: categoryLineLabelPositions['Celkem'].textAnchor
    }
  })

  return {
    x,
    yTotal,
    yCategories,
    width,
    height,
    lineTotal,
    lineCategories,
    destroy: () => {
      vizSvg.selectAll('*').remove();
    }
  }
}

const vizSteps = {
  2: {
    fromPrevious: ({ vizSvg, viz }) => {
      const { x, yTotal } = viz

      const svgXAxisAnnotationsG = vizSvg.append('g')
        .attr('class', 'g-xaxis-annotations')
        // Makes the <g> element first under <svg>, therefore behind
        // all the other parts
        .lower()

      // First republic label

      svgXAxisAnnotationsG.append('text')
        .attr('class', 'first-republic-label')
        .text('První republika')
        .attr('x', x(d3.timeParse('%Y')(1929)))
        // .attr('y', 38)
        .attr('y', yTotal(0) + 40)
        .attr('text-anchor', 'middle')
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 1)

      // 2WW band

      svgXAxisAnnotationsG.append('rect')
        .attr('class', 'secondww-rect')
        .attr('width', x(d3.timeParse('%Y')(1945)) - x(d3.timeParse('%Y')(1939)))
        // .attr('height', yTotal(0) - 15)
        .attr('height', yTotal(0) - yTotal(2200) + 50)
        .attr('x', x(d3.timeParse('%Y')(1939)))
        .attr('y', yTotal(2200))
        .style("fill", "#f5f5f5")
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 1)
      
      // 2WW label

      svgXAxisAnnotationsG.append('text')
        .attr('class', 'secondww-label')
        .text('2. světová válka')
        .attr('x', x(d3.timeParse('%Y')(1942)))
        // .attr('y', 38)
        .attr('y', yTotal(0) + 40)
        .attr('text-anchor', 'middle')
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 1)

      // Communist coup line

      svgXAxisAnnotationsG.append('line')
        .attr('class', 'communist-coup-line')
        .attr('x1', x(d3.timeParse('%Y')(1948)))
        // .attr('y1', yTotal(0))
        .attr('y1', yTotal(0) + 50)
        .attr('x2', x(d3.timeParse('%Y')(1948)))
        // .attr('y2', 15)
        .attr('y2', yTotal(2200))
        .attr("stroke", '#cccccc')
        .attr("stroke-width", 1)
        .attr('stroke-dasharray', '4,4')
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("fill", "none")
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 1)

      // Communist coup label

      const communistCoupLabel = svgXAxisAnnotationsG.append('text')
        .attr('class', 'communist-coup-label')
        // .attr('y', 60)
        .attr('y', yTotal(0) + 35)

        .attr('text-anchor', 'end')

      communistCoupLabel.attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 1)

      communistCoupLabel.append('tspan').text('Komunistický').attr('x', x(d3.timeParse('%Y')(1948)) - 5)
      communistCoupLabel.append('tspan').text('převrat').attr('dy', 15).attr('x', x(d3.timeParse('%Y')(1948)) - 5)

    },
    backToPrevious: ({ vizSvg }) => {
      // Remove annotations

      vizSvg.select('.g-xaxis-annotations')
        .remove()
    }
  },

  3: {
    fromPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      const { x, yTotal, yCategories, lineTotal, lineCategories } = viz

      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')
      const data1919MzStdCategoryTotal = data1919MzStd.find(category => category.skupina === 'Celkem')

      // 1. Instantly remove the original total line

      removeCategoryLine({ vizSvg, categoryName: 'Celkem' })

      // 2. Instantly add all the category lines with the data of total

      data1919MzStdWithoutTotal.forEach(category => {
        addCategoryLine({
          vizSvg,
          categoryName: category.skupina,
          // We start by rendering all the lines using the category total data
          // so we can then "break" that line using animation into the category-lines
          d: lineTotal(data1919MzStdCategoryTotal.data),
          style: 'active',
          activeColor: categoryColorsActive['Celkem']
        })
      })

      // 3. Animation part 1: "Break" the total line into category lines and fade away
      // the total line label

      data1919MzStdWithoutTotal.forEach(category => {
        changeCategoryLine({
          vizSvg,
          categoryName: category.skupina,
          // We animate to the category data using the total scale
          d: lineTotal(category.data),
          duration: 700,
          style: 'anonymous'
        })
      })

      changeCategoryLineLabel({
        vizSvg,
        categoryName: 'Celkem',
        position: {
          x: x(categoryLineLabelPositions['Celkem'].x),
          y: yTotal(categoryLineLabelPositions['Celkem'].y),
          textAnchor: categoryLineLabelPositions['Celkem'].textAnchor
        },
        opacity: 0,
        duration: 700
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

      data1919MzStdWithoutTotal.forEach(category => {
        changeCategoryLine({
          vizSvg,
          categoryName: category.skupina,
          // We animate to the category data using the categories scale
          d: lineCategories(category.data),
          duration: 700,
          delay: 700,
          style: 'anonymous'
        })
      })

      // 5. Move annotations below the axis

      // const svgXAxisAnnotationsG = vizSvg.select('.g-xaxis-annotations')

      // svgXAxisAnnotationsG.select('.first-republic-label')
      //   .transition()
      //   .duration(700)
      //   .delay(1400)
      //   .attr('y', yCategories(0) + 40)

      // svgXAxisAnnotationsG.select('.secondww-rect')
      //   .transition()
      //   .duration(700)
      //   .delay(1400)
      //   .attr('height', 50)
      //   .attr('y', yCategories(0))

      // svgXAxisAnnotationsG.select('.secondww-label')
      //   .transition()
      //   .duration(700)
      //   .delay(1400)
      //   .attr('y', yCategories(0) + 40)

      // svgXAxisAnnotationsG.select('.communist-coup-line')
      //   .transition()
      //   .duration(700)
      //   .delay(1400)
      //   .attr('y1', yCategories(0) + 50)
      //   .attr('y2', yCategories(0))

      // svgXAxisAnnotationsG.select('.communist-coup-label')
      //   .transition()
      //   .duration(700)
      //   .delay(1400)
      //   .attr('y', yCategories(0) + 35)
      
    },
    backToPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      const { x, yTotal, lineTotal } = viz

      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')
      const data1919MzStdCategoryTotal = data1919MzStd.find(category => category.skupina === 'Celkem')

      addCategoryLine({
        vizSvg, 
        categoryName: 'Celkem',
        d: lineTotal(data1919MzStdCategoryTotal.data),
        style: 'active',
        activeColor: categoryColorsActive['Celkem']
      })

      changeCategoryLineLabel({
        vizSvg,
        categoryName: 'Celkem',
        position: {
          x: x(categoryLineLabelPositions['Celkem'].x),
          y: yTotal(categoryLineLabelPositions['Celkem'].y),
          textAnchor: categoryLineLabelPositions['Celkem'].textAnchor
        },
        opacity: 1
      })

      data1919MzStdWithoutTotal.forEach(category => {
        removeCategoryLine({ vizSvg, categoryName: category.skupina })
      })

      const yAxis = g => g
        .attr("transform", `translate(${vizMargin.left},0)`)
        .call(d3.axisLeft(yTotal))

      vizSvg.select('.g-axis-y')
        .transition()
        .duration(700)
        .call(yAxis);
    },
  },

  4: {
    fromPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        vizSvg,
        line: viz.lineCategories,
        x: viz.x,
        y: viz.yCategories,
        data1919MzStd,
        activeCategoryNames: ['Nemoci nakažlivé a cizopasné']
      })
    },
    backToPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      const { lineCategories } = viz

      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')

      data1919MzStdWithoutTotal.forEach(category => {
        changeCategoryLine({
          vizSvg,
          categoryName: category.skupina,
          d: lineCategories(category.data),
          style: 'anonymous'
        })
      })

      removeCategoryLineLabel({ vizSvg, categoryName: 'Nemoci nakažlivé a cizopasné' })
    }
  },

  5: {
    fromPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        vizSvg,
        line: viz.lineCategories,
        x: viz.x,
        y: viz.yCategories,
        data1919MzStd,
        activeCategoryNames: ['Nemoci nakažlivé a cizopasné', 'Nemoci ústrojí oběhu krevního']
      })
    },
    backToPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        vizSvg,
        line: viz.lineCategories,
        x: viz.x,
        y: viz.yCategories,
        data1919MzStd,
        activeCategoryNames: ['Nemoci nakažlivé a cizopasné']
      })
    }
  },

  6: {
    fromPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        vizSvg,
        line: viz.lineCategories,
        x: viz.x,
        y: viz.yCategories,
        data1919MzStd,
        activeCategoryNames: ['Rakovina a jiné nádory']
      })
    },
    backToPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        vizSvg,
        line: viz.lineCategories,
        x: viz.x,
        y: viz.yCategories,
        data1919MzStd,
        activeCategoryNames: ['Nemoci nakažlivé a cizopasné', 'Nemoci ústrojí oběhu krevního']
      })
    }
  },

  7: {
    fromPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        vizSvg,
        line: viz.lineCategories,
        x: viz.x,
        y: viz.yCategories,
        data1919MzStd,
        activeCategoryNames: ['Válečné akce a soudní poprava']
      })

      // TODO: show annotations for 42 and 45
    },
    backToPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        vizSvg,
        line: viz.lineCategories,
        x: viz.x,
        y: viz.yCategories,
        data1919MzStd,
        activeCategoryNames: ['Rakovina a jiné nádory']
      })

      // TODO: hide annotations for 42 and 45
    }
  },

  8: {
    fromPrevious: ({ vizSvg, viz, data1919MzStd, data1919MStd, data1919ZStd }) => {
      const categoryWarName = 'Válečné akce a soudní poprava'

      const data1919MzStdCategoryWar = data1919MzStd.find(category => category.skupina === categoryWarName)
      const data1919MStdCategoryWar = data1919MStd.find(category => category.skupina === categoryWarName)
      const data1919ZStdCategoryWar = data1919ZStd.find(category => category.skupina === categoryWarName)

      // 1. Instantly remove the men+women category war line and the label

      removeCategoryLine({ vizSvg, categoryName: 'Válečné akce a soudní poprava' })

      changeCategoryLineLabel({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava',
        position: {
          x: viz.x(categoryLineLabelPositions['Válečné akce a soudní poprava'].x),
          y: viz.yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava'].textAnchor
        },
        opacity: 0,
        duration: 700
      })

      removeCategoryLineLabel({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava',
      })

      // 2. Instantly add separate men and women lines using the men+women data

      addCategoryLine({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        d: viz.lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava']
      })
      addCategoryLine({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        d: viz.lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava']
      })

      // 3. Break the men+women line to the separate lines using animation and add labels

      changeCategoryLine({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        d: viz.lineCategories(data1919MStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava - muži'],
        duration: 700
      })
      changeCategoryLine({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        d: viz.lineCategories(data1919ZStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava - ženy'],
        duration: 700
      })

      addCategoryLineLabel({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        position: {
          x: viz.x(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
          y: viz.yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor
        },
        opacity: 0
      })
      changeCategoryLineLabel({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        position: {
          x: viz.x(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
          y: viz.yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor
        },
        opacity: 1,
        duration: 700
      })

      addCategoryLineLabel({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        position: {
          x: viz.x(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
          y: viz.yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor
        },
        opacity: 0
      })
      changeCategoryLineLabel({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        position: {
          x: viz.x(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
          y: viz.yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor
        },
        opacity: 1,
        duration: 700
      })
    },
    backToPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      removeCategoryLine({ vizSvg, categoryName: 'Válečné akce a soudní poprava - muži' })
      removeCategoryLine({ vizSvg, categoryName: 'Válečné akce a soudní poprava - ženy' })

      removeCategoryLineLabel({ vizSvg, categoryName: 'Válečné akce a soudní poprava - muži' })
      removeCategoryLineLabel({ vizSvg, categoryName: 'Válečné akce a soudní poprava - ženy' })

      const categoryWarName = 'Válečné akce a soudní poprava'
      const data1919MzStdCategoryWar = data1919MzStd.find(category => category.skupina === categoryWarName)

      addCategoryLine({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava',
        d: viz.lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava']
      })

      changeActiveNonTotalCategoryLines({
        vizSvg,
        line: viz.lineCategories,
        x: viz.x,
        y: viz.yCategories,
        data1919MzStd,
        activeCategoryNames: ['Válečné akce a soudní poprava']
      })
    }
  },

  9: {
    fromPrevious: ({ vizSvg, viz, data1919MzStd }) => {
      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')
      const data1919MzStdCategoryWar = data1919MzStd.find(category => category.skupina === 'Válečné akce a soudní poprava')

      // 1. Animate the separate men and women category war lines together and fade away labels (and remove them)

      changeCategoryLine({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        d: viz.lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava'],
        duration: 700
      })
      changeCategoryLine({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        d: viz.lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava'],
        duration: 700
      })
      
      changeCategoryLineLabel({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        position: {
          x: viz.x(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
          y: viz.yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor
        },
        opacity: 0,
        duration: 700
      })
      removeCategoryLineLabel({ vizSvg, categoryName: 'Válečné akce a soudní poprava - muži', delay: 700 })

      changeCategoryLineLabel({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        position: {
          x: viz.x(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
          y: viz.yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor
        },
        opacity: 0,
        duration: 700
      })
      removeCategoryLineLabel({ vizSvg, categoryName: 'Válečné akce a soudní poprava - ženy', delay: 700 })

      // 2. Then instantly remove the separate lines and replace them with single men+women line again
 
      removeCategoryLine({ vizSvg, categoryName: 'Válečné akce a soudní poprava - muži', delay: 700 })
      removeCategoryLine({ vizSvg, categoryName: 'Válečné akce a soudní poprava - ženy', delay: 700 })

      addCategoryLine({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava',
        d: viz.lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava'],
        delay: 700
      })

      // 3. And activate all the lines

      data1919MzStdWithoutTotal.forEach(category => {
        changeCategoryLine({
          vizSvg,
          categoryName: category.skupina,
          d: viz.lineCategories(category.data),
          style: 'active',
          activeColor: categoryColorsActive[category.skupina],
          duration: 700,
          delay: 700
        })
      })

    },
    backToPrevious: ({ vizSvg, viz, data1919MzStd, data1919MStd, data1919ZStd }) => {
      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')

      const categoryWarName = 'Válečné akce a soudní poprava'

      const data1919MStdCategoryWar = data1919MStd.find(category => category.skupina === categoryWarName)
      const data1919ZStdCategoryWar = data1919ZStd.find(category => category.skupina === categoryWarName)

      data1919MzStdWithoutTotal.forEach(category => {
        changeCategoryLine({
          vizSvg,
          categoryName: category.skupina,
          d: viz.lineCategories(category.data),
          style: 'context'
        })
      })

      removeCategoryLine({ vizSvg, categoryName: categoryWarName })

      addCategoryLine({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        d: viz.lineCategories(data1919MStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava - muži']
      })
      addCategoryLine({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        d: viz.lineCategories(data1919ZStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava - ženy']
      })

      addCategoryLineLabel({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        position: {
          x: viz.x(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
          y: viz.yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor
        }
      })
      addCategoryLineLabel({
        vizSvg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        position: {
          x: viz.x(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
          y: viz.yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor
        }
      })
    }
  }
}

const vizMargin = ({ top: 60, right: 30, bottom: 200, left: 60 })

const categoryColorsActive = {
  'Celkem': '#000000',
  'Nemoci nakažlivé a cizopasné': '#f95d6a',
  'Nemoci ústrojí oběhu krevního': '#ffa600',
  'Rakovina a jiné nádory': '#a05195',
  'Válečné akce a soudní poprava': '#804500',

  'Válečné akce a soudní poprava - muži': '#2A4B8C',
  'Válečné akce a soudní poprava - ženy': '#B90101',

  'Nemoci rheumatické, výživové, žláz s vnitřním vyměšováním, jiné nemoci celkové a avitaminos': '#000000',
  'Nemoci krve a ústrojů krvetvorných': '#11a579',
  'Otravy vleklé': '#3969ac',
  'Nemoci soustavy nervové a smyslových ústrojů': '#f2b701',
  'Nemoci ústrojů dýchacích': '#e73f74',
  'Nemoci ústrojí zažívacího': '#80ba5a',
  'Nemoci ústrojí močového a pohlavního': '#e68310',
  'Nemoci těhotenství, porodu a stavu poporodního': '#e68310',
  'Nemoci kůže a vaziva podkožního': '#008695',
  'Nemoci kostí a ústrojí pohybu': '#cf1c90',
  'Vrozené vady vývojové': '#f97b72',
  'Zvláštní nemoci útlého věku': '#4b4b8f',
  'Stařecká sešlost': '#a5aa99',
  'Sebevraždy': '#0ebcbf',
  'Vraždy a zabití': '#5158bb',
  'Úrazy při dopravě': '#9e52aa',
  'Úrazy a otravy mimo dopravu': '#eb4776',
  'Neurčité příčiny smrti': '#f58a5a'
};

const categoryLineLabelPositions = {
  'Celkem': { x: d3.timeParse('%Y')(1927), y: 1700, textAnchor: 'start' },
  'Nemoci nakažlivé a cizopasné': { x: d3.timeParse('%Y')(1927), y: 250, textAnchor: 'start' },
  'Nemoci ústrojí oběhu krevního': { x: d3.timeParse('%Y')(1929), y: 380, textAnchor: 'start' },
  'Rakovina a jiné nádory': { x: d3.timeParse('%Y')(1933), y: 220, textAnchor: 'start' },
  'Válečné akce a soudní poprava': { x: d3.timeParse('%Y')(1940), y: 40, textAnchor: 'end' },

  'Válečné akce a soudní poprava - muži': { x: d3.timeParse('%Y')(1945), y: 260, textAnchor: 'end' },
  'Válečné akce a soudní poprava - ženy': { x: d3.timeParse('%Y')(1944), y: 70, textAnchor: 'end' },
}

const categoryLineLabelTexts = {
  'Celkem': 'Celkové počty úmrtí',
  'Válečné akce a soudní poprava - muži': 'Muži',
  'Válečné akce a soudní poprava - ženy': 'Ženy'
}

// const labelPosition = {
//   "nemoci-nakazlive-a-cizopasne" : { x: 1927, y: 250 },
//   "nemoci-ustroji-obehu-krevniho" : { x: 1929, y: 380 },
//   "rakovina-a-jine-nadory" : { x: 1933, y: 220 },
//   "valecne-akce-a-soudni-poprava" :  { x: 1935, y: 100 },
//   "starecka-seslost" :  { x: 1923, y: 500 },
//   "nemoci-ustroju-dychacich" :  { x: 1937, y: 150 },
//   "nemoci-soustavy-nervove-a-smyslovych-ustroju" :  { x: 1921, y: 140 },
//   "nemoci-ustroji-zazivaciho" :  { x: 1930, y: 75 },
//   "sebevrazdy" :  { x: 1922, y: 42 },


//   "neurcite-priciny-smrti" :  { x: 1920, y: -50 },
//   "nemoci-rheumaticke-vyzivove-zlaz-s-vnitrnim-vymesovanim-jine-nemoci-celkove-a-avitaminos" : { x: 1920, y: -70 },
//   "nemoci-krve-a-ustroju-krvetvornych" :  { x: 1920, y: -90 },
//   "otravy-vlekle" :  { x: 1920, y: -110 },
//   "nemoci-ustroji-mocoveho-a-pohlavniho" :  { x: 1930, y: -50 },
//   "nemoci-kuze-a-vaziva-podkozniho" :  { x: 1930, y: -130 },
//   "nemoci-kosti-a-ustroji-pohybu" :  { x: 1934, y: -90 },
//   "vrozene-vady-vyvojove" :  { x: 1926, y: -110 },
//   "zvlastni-nemoci-utleho-veku" :  { x: 1920, y: -130 },
//   "vrazdy-a-zabiti" :  { x: 1920, y: -150 },
//   "urazy-pri-doprave" :  { x: 1938, y: -130 },
//   "urazy-a-otravy-mimo-dopravu" :  { x: 1938, y: -110 },
//   "nemoci-tehotenstvi-porodu-a-stavu-poporodniho": { x: 1938, y: -110 }
// }

const changeActiveNonTotalCategoryLines = ({ vizSvg, data1919MzStd, line, x, y, activeCategoryNames }) => {
  const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')

  data1919MzStdWithoutTotal.forEach(category => {
    let style = 'context'
    let activeColor
    if (activeCategoryNames.includes(category.skupina)) {
      style = 'active'
      activeColor = categoryColorsActive[category.skupina]
    }

    changeCategoryLine({
      vizSvg,
      categoryName: category.skupina,
      d: line(category.data),
      style,
      activeColor,
      duration: 700
    })

    const labelExists = isAddedCategoryLineLabel({ vizSvg, categoryName: category.skupina })

    if (activeCategoryNames.includes(category.skupina) && !labelExists) {
      addCategoryLineLabel({
        vizSvg,
        categoryName: category.skupina,
        position: {
          x: x(categoryLineLabelPositions[category.skupina].x),
          y: y(categoryLineLabelPositions[category.skupina].y),
          textAnchor: categoryLineLabelPositions[category.skupina].textAnchor
        },
        opacity: 0
      })

      changeCategoryLineLabel({
        vizSvg,
        categoryName: category.skupina,
        position: {
          x: x(categoryLineLabelPositions[category.skupina].x),
          y: y(categoryLineLabelPositions[category.skupina].y),
          textAnchor: categoryLineLabelPositions[category.skupina].textAnchor
        },
        opacity: 1,
        duration: 700
      })
    } else if (!activeCategoryNames.includes(category.skupina) && labelExists) {
      changeCategoryLineLabel({
        vizSvg,
        categoryName: category.skupina,
        position: {
          x: x(categoryLineLabelPositions[category.skupina].x),
          y: y(categoryLineLabelPositions[category.skupina].y),
          textAnchor: categoryLineLabelPositions[category.skupina].textAnchor
        },
        opacity: 0,
        duration: 700
      })

      removeCategoryLineLabel({
        vizSvg,
        categoryName: category.skupina,
        delay: 700
      })
    }
  })

  activeCategoryNames.forEach(categoryName => {
    bringCategoryLineToFront({ vizSvg, categoryName })  
  })
}

const changeCategoryLineLabel = ({ vizSvg, categoryName, position, opacity = 1, duration = 0, delay = 0 }) => {
  const textToDisplay = categoryLineLabelTexts[categoryName] ? categoryLineLabelTexts[categoryName] : categoryName

  vizSvg.select(`.g-line-labels .${kebabCase(categoryName)}`)
    .transition()
    .duration(duration)
    .delay(delay)
    .text(textToDisplay)
    .attr('x', position.x)
    .attr('y', position.y)
    .attr('text-anchor', position.textAnchor)
    .attr('fill', categoryColorsActive[categoryName])
    .attr('opacity', opacity)
}

const addCategoryLineLabel = ({ vizSvg, categoryName, position, opacity = 1 }) => {
  vizSvg.select('.g-line-labels')
    .append('text')
    .attr('class', kebabCase(categoryName))

  changeCategoryLineLabel({ vizSvg, categoryName, position, opacity })
}

const removeCategoryLineLabel = ({ vizSvg, categoryName, delay = 0 }) => {
  vizSvg.select(`.g-line-labels .${kebabCase(categoryName)}`)
    .transition()
    .duration(0)
    .delay(delay)
    .remove()
}

const isAddedCategoryLineLabel = ({ vizSvg, categoryName }) => {
  return !vizSvg.select(`.g-line-labels .${kebabCase(categoryName)}`).empty()
}

const changeCategoryLine = ({ vizSvg, categoryName, d, style, activeColor, duration = 0, delay = 0 }) => {
  let stroke
  let strokeWidth
  if (style === 'context') {
    stroke = '#E1E2DF'
    strokeWidth = 1
  } else if (style === 'anonymous') {
    stroke = '#aaaaaa'
    strokeWidth = 2
  } else if (style === 'active') {
    stroke = activeColor
    strokeWidth = 2
  } else {
    throw new Error(`Unknown category line style: ${style}`)
  }

  vizSvg.select(`.g-lines .${kebabCase(categoryName)}`)
    .transition()
    .duration(duration)
    .delay(delay)
    .attr('d', d)
    .attr('stroke', stroke)
    .attr('stroke-width', strokeWidth)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('fill', 'none')
}

const bringCategoryLineToFront = ({ vizSvg, categoryName }) => {
  vizSvg.select(`.g-lines .${kebabCase(categoryName)}`)
    .raise()
}

const addCategoryLine = ({ vizSvg, categoryName, d, style, activeColor }) => {
  vizSvg.select('.g-lines')
    .append('path')
    .attr('class', kebabCase(categoryName))

  changeCategoryLine({ vizSvg, categoryName, d, style, activeColor })
}

const removeCategoryLine = ({ vizSvg, categoryName, delay = 0 }) => {
  vizSvg.select(`.g-lines .${kebabCase(categoryName)}`)
    .transition()
    .duration(0)
    .delay(delay)
    .remove()
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
    let scroller = initScrollama({ vizSvg, data1919MzStd, data1919MStd, data1919ZStd, vizSteps, viz });

    const reinitVizAfterResize = () => {
      viz.destroy();
      scroller.destroy();
  
      viz = initViz({ vizSvg, data1919MzStd, data1919MStd, data1919ZStd });
      scroller = initScrollama({ vizSvg, data1919MzStd, data1919MStd, data1919ZStd, vizSteps, viz });
    }
    const reinitVizAfterResizeDebounced = debounce(reinitVizAfterResize, 200)
  
    window.addEventListener('resize', reinitVizAfterResizeDebounced)
  })
})();
