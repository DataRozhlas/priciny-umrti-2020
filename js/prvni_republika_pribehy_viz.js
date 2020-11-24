import * as d3 from 'd3'
import kebabCase from 'lodash/kebabCase'

export const initViz = (svgSelector, data) => {
  const svg = d3.select(svgSelector)

  // We want the parent div of the svg to get the available space
  const { width, height } = svg.node().parentNode.getBoundingClientRect()

  svg.attr("viewBox", [0, 0, width, height]);

  const { data1919MzStd, data1919MStd, data1919ZStd } = data
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

  svg.append("g")
    .attr("class", "g-axis-x")
    .call(xAxis);

  svg.append("g")
    .attr("class", "g-axis-y")
    .call(yAxis);

  const svgAxesLabelsG = svg.append("g")
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

  svg.append("g")
    .attr("class", "g-lines")
  
  const totalCategory = data1919MzStd.find(category => category.skupina === 'Celkem')

  addCategoryLine({
    svg, 
    categoryName: 'Celkem',
    d: lineTotal(totalCategory.data),
    style: 'active',
    activeColor: categoryColorsActive['Celkem']
  })
  
  // 4. Labels

  svg.append("g")
    .attr('class', 'g-line-labels')

  addCategoryLineLabel({
    svg,
    categoryName: 'Celkem',
    position: {
      x: x(categoryLineLabelPositions['Celkem'].x),
      y: yTotal(categoryLineLabelPositions['Celkem'].y),
      textAnchor: categoryLineLabelPositions['Celkem'].textAnchor
    }
  })

  const viz = {
    svg,
    data1919MzStd,
    data1919MStd,
    data1919ZStd,
    x,
    yTotal,
    yCategories,
    lineTotal,
    lineCategories
  }

  return {
    destroy: () => {
      svg.selectAll('*').remove();
    },
    onScrollDownToStep: (stepIndex) => {
      if (vizSteps[stepIndex] && vizSteps[stepIndex].onScrollDownToStep) {
        vizSteps[stepIndex].onScrollDownToStep(viz)
      }
    },
    onScrollUpFromStep: (stepIndex) => {
      if (vizSteps[stepIndex] && vizSteps[stepIndex].onScrollUpFromStep) {
        vizSteps[stepIndex].onScrollUpFromStep(viz)
      }
    }
  }
}

const vizSteps = {
  1: {
    onScrollDownToStep: ({ svg, x, yTotal }) => {
      const svgXAxisAnnotationsG = svg.append('g')
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
    onScrollUpFromStep: ({ svg }) => {
      // Remove annotations

      svg.select('.g-xaxis-annotations')
        .remove()
    }
  },

  2: {
    onScrollDownToStep: ({ svg, x, yTotal, yCategories, lineTotal, lineCategories, data1919MzStd }) => {
      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')
      const data1919MzStdCategoryTotal = data1919MzStd.find(category => category.skupina === 'Celkem')

      // 1. Instantly remove the original total line

      removeCategoryLine({ svg, categoryName: 'Celkem' })

      // 2. Instantly add all the category lines with the data of total

      data1919MzStdWithoutTotal.forEach(category => {
        addCategoryLine({
          svg,
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
          svg,
          categoryName: category.skupina,
          // We animate to the category data using the total scale
          d: lineTotal(category.data),
          duration: 700,
          style: 'anonymous'
        })
      })

      changeCategoryLineLabel({
        svg,
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

      svg.select('.g-axis-y')
        .transition()
        .duration(700)
        .delay(700)
        .call(yAxis);

      data1919MzStdWithoutTotal.forEach(category => {
        changeCategoryLine({
          svg,
          categoryName: category.skupina,
          // We animate to the category data using the categories scale
          d: lineCategories(category.data),
          duration: 700,
          delay: 700,
          style: 'anonymous'
        })
      })

      // 5. Move annotations below the axis

      // const svgXAxisAnnotationsG = svg.select('.g-xaxis-annotations')

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
    onScrollUpFromStep: ({ svg, x, yTotal, lineTotal, data1919MzStd }) => {
      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')
      const data1919MzStdCategoryTotal = data1919MzStd.find(category => category.skupina === 'Celkem')

      addCategoryLine({
        svg, 
        categoryName: 'Celkem',
        d: lineTotal(data1919MzStdCategoryTotal.data),
        style: 'active',
        activeColor: categoryColorsActive['Celkem']
      })

      changeCategoryLineLabel({
        svg,
        categoryName: 'Celkem',
        position: {
          x: x(categoryLineLabelPositions['Celkem'].x),
          y: yTotal(categoryLineLabelPositions['Celkem'].y),
          textAnchor: categoryLineLabelPositions['Celkem'].textAnchor
        },
        opacity: 1
      })

      data1919MzStdWithoutTotal.forEach(category => {
        removeCategoryLine({ svg, categoryName: category.skupina })
      })

      const yAxis = g => g
        .attr("transform", `translate(${vizMargin.left},0)`)
        .call(d3.axisLeft(yTotal))

      svg.select('.g-axis-y')
        .transition()
        .duration(700)
        .call(yAxis);
    },    
  },

  3: {
    onScrollDownToStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        svg,
        line: lineCategories,
        x,
        y: yCategories,
        data1919MzStd,
        activeCategoryNames: ['Nemoci nakažlivé a cizopasné']
      })
    },
    onScrollUpFromStep: ({ svg, lineCategories, data1919MzStd }) => {
      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')

      data1919MzStdWithoutTotal.forEach(category => {
        changeCategoryLine({
          svg,
          categoryName: category.skupina,
          d: lineCategories(category.data),
          style: 'anonymous'
        })
      })

      removeCategoryLineLabel({ svg, categoryName: 'Nemoci nakažlivé a cizopasné' })
    }
  },

  4: {
    onScrollDownToStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        svg,
        line: lineCategories,
        x,
        y: yCategories,
        data1919MzStd,
        activeCategoryNames: ['Nemoci nakažlivé a cizopasné', 'Nemoci ústrojí oběhu krevního']
      })
    },
    onScrollUpFromStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        svg,
        line: lineCategories,
        x,
        y: yCategories,
        data1919MzStd,
        activeCategoryNames: ['Nemoci nakažlivé a cizopasné']
      })
    }
  },

  5: {
    onScrollDownToStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        svg,
        line: lineCategories,
        x,
        y: yCategories,
        data1919MzStd,
        activeCategoryNames: ['Rakovina a jiné nádory']
      })
    },
    onScrollUpFromStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        svg,
        line: lineCategories,
        x,
        y: yCategories,
        data1919MzStd,
        activeCategoryNames: ['Nemoci nakažlivé a cizopasné', 'Nemoci ústrojí oběhu krevního']
      })
    }
  },

  6: {
    onScrollDownToStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        svg,
        line: lineCategories,
        x,
        y: yCategories,
        data1919MzStd,
        activeCategoryNames: ['Válečné akce a soudní poprava']
      })

      // TODO: show annotations for 42 and 45
    },
    onScrollUpFromStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
      changeActiveNonTotalCategoryLines({
        svg,
        line: lineCategories,
        x,
        y: yCategories,
        data1919MzStd,
        activeCategoryNames: ['Rakovina a jiné nádory']
      })

      // TODO: hide annotations for 42 and 45
    }
  },

  7: {
    onScrollDownToStep: ({ svg, data1919MzStd, data1919MStd, data1919ZStd, x, yCategories, lineCategories }) => {
      const categoryWarName = 'Válečné akce a soudní poprava'

      const data1919MzStdCategoryWar = data1919MzStd.find(category => category.skupina === categoryWarName)
      const data1919MStdCategoryWar = data1919MStd.find(category => category.skupina === categoryWarName)
      const data1919ZStdCategoryWar = data1919ZStd.find(category => category.skupina === categoryWarName)

      // 1. Instantly remove the men+women category war line and the label

      removeCategoryLine({ svg, categoryName: 'Válečné akce a soudní poprava' })

      changeCategoryLineLabel({
        svg,
        categoryName: 'Válečné akce a soudní poprava',
        position: {
          x: x(categoryLineLabelPositions['Válečné akce a soudní poprava'].x),
          y: yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava'].textAnchor
        },
        opacity: 0,
        duration: 700
      })

      removeCategoryLineLabel({
        svg,
        categoryName: 'Válečné akce a soudní poprava',
      })

      // 2. Instantly add separate men and women lines using the men+women data

      addCategoryLine({
        svg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        d: lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava']
      })
      addCategoryLine({
        svg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        d: lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava']
      })

      // 3. Break the men+women line to the separate lines using animation and add labels

      changeCategoryLine({
        svg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        d: lineCategories(data1919MStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava - muži'],
        duration: 700
      })
      changeCategoryLine({
        svg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        d: lineCategories(data1919ZStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava - ženy'],
        duration: 700
      })

      addCategoryLineLabel({
        svg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        position: {
          x: x(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
          y: yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor
        },
        opacity: 0
      })
      changeCategoryLineLabel({
        svg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        position: {
          x: x(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
          y: yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor
        },
        opacity: 1,
        duration: 700
      })

      addCategoryLineLabel({
        svg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        position: {
          x: x(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
          y: yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor
        },
        opacity: 0
      })
      changeCategoryLineLabel({
        svg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        position: {
          x: x(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
          y: yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor
        },
        opacity: 1,
        duration: 700
      })
    },
    onScrollUpFromStep: ({ svg, data1919MzStd, x, yCategories, lineCategories }) => {
      removeCategoryLine({ svg, categoryName: 'Válečné akce a soudní poprava - muži' })
      removeCategoryLine({ svg, categoryName: 'Válečné akce a soudní poprava - ženy' })

      removeCategoryLineLabel({ svg, categoryName: 'Válečné akce a soudní poprava - muži' })
      removeCategoryLineLabel({ svg, categoryName: 'Válečné akce a soudní poprava - ženy' })

      const categoryWarName = 'Válečné akce a soudní poprava'
      const data1919MzStdCategoryWar = data1919MzStd.find(category => category.skupina === categoryWarName)

      addCategoryLine({
        svg,
        categoryName: 'Válečné akce a soudní poprava',
        d: lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava']
      })

      changeActiveNonTotalCategoryLines({
        svg,
        line: lineCategories,
        x,
        y: yCategories,
        data1919MzStd,
        activeCategoryNames: ['Válečné akce a soudní poprava']
      })
    }
  },

  8: {
    onScrollDownToStep: ({ svg, data1919MzStd, x, yCategories, lineCategories }) => {
      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')
      const data1919MzStdCategoryWar = data1919MzStd.find(category => category.skupina === 'Válečné akce a soudní poprava')

      // 1. Animate the separate men and women category war lines together and fade away labels (and remove them)

      changeCategoryLine({
        svg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        d: lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava'],
        duration: 700
      })
      changeCategoryLine({
        svg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        d: lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava'],
        duration: 700
      })
      
      changeCategoryLineLabel({
        svg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        position: {
          x: x(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
          y: yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor
        },
        opacity: 0,
        duration: 700
      })
      removeCategoryLineLabel({ svg, categoryName: 'Válečné akce a soudní poprava - muži', delay: 700 })

      changeCategoryLineLabel({
        svg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        position: {
          x: x(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
          y: yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor
        },
        opacity: 0,
        duration: 700
      })
      removeCategoryLineLabel({ svg, categoryName: 'Válečné akce a soudní poprava - ženy', delay: 700 })

      // 2. Then instantly remove the separate lines and replace them with single men+women line again
 
      removeCategoryLine({ svg, categoryName: 'Válečné akce a soudní poprava - muži', delay: 700 })
      removeCategoryLine({ svg, categoryName: 'Válečné akce a soudní poprava - ženy', delay: 700 })

      addCategoryLine({
        svg,
        categoryName: 'Válečné akce a soudní poprava',
        d: lineCategories(data1919MzStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava'],
        delay: 700
      })

      // 3. And activate all the lines

      data1919MzStdWithoutTotal.forEach(category => {
        changeCategoryLine({
          svg,
          categoryName: category.skupina,
          d: lineCategories(category.data),
          style: 'active',
          activeColor: categoryColorsActive[category.skupina],
          duration: 700,
          delay: 700
        })
      })

    },
    onScrollUpFromStep: ({ svg, data1919MzStd, data1919MStd, data1919ZStd, x, yCategories, lineCategories }) => {
      const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')

      const categoryWarName = 'Válečné akce a soudní poprava'

      const data1919MStdCategoryWar = data1919MStd.find(category => category.skupina === categoryWarName)
      const data1919ZStdCategoryWar = data1919ZStd.find(category => category.skupina === categoryWarName)

      data1919MzStdWithoutTotal.forEach(category => {
        changeCategoryLine({
          svg,
          categoryName: category.skupina,
          d: lineCategories(category.data),
          style: 'context'
        })
      })

      removeCategoryLine({ svg, categoryName: categoryWarName })

      addCategoryLine({
        svg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        d: lineCategories(data1919MStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava - muži']
      })
      addCategoryLine({
        svg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        d: lineCategories(data1919ZStdCategoryWar.data),
        style: 'active',
        activeColor: categoryColorsActive['Válečné akce a soudní poprava - ženy']
      })

      addCategoryLineLabel({
        svg,
        categoryName: 'Válečné akce a soudní poprava - muži',
        position: {
          x: x(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
          y: yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor
        }
      })
      addCategoryLineLabel({
        svg,
        categoryName: 'Válečné akce a soudní poprava - ženy',
        position: {
          x: x(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
          y: yCategories(categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
          textAnchor: categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor
        }
      })
    }
  }
}

const vizMargin = ({ top: 60, right: 30, bottom: 100, left: 60 })

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

const changeActiveNonTotalCategoryLines = ({ svg, data1919MzStd, line, x, y, activeCategoryNames }) => {
  const data1919MzStdWithoutTotal = data1919MzStd.filter(category => category.skupina !== 'Celkem')

  data1919MzStdWithoutTotal.forEach(category => {
    let style = 'context'
    let activeColor
    if (activeCategoryNames.includes(category.skupina)) {
      style = 'active'
      activeColor = categoryColorsActive[category.skupina]
    }

    changeCategoryLine({
      svg,
      categoryName: category.skupina,
      d: line(category.data),
      style,
      activeColor,
      duration: 700
    })

    const labelExists = isAddedCategoryLineLabel({ svg, categoryName: category.skupina })

    if (activeCategoryNames.includes(category.skupina) && !labelExists) {
      addCategoryLineLabel({
        svg,
        categoryName: category.skupina,
        position: {
          x: x(categoryLineLabelPositions[category.skupina].x),
          y: y(categoryLineLabelPositions[category.skupina].y),
          textAnchor: categoryLineLabelPositions[category.skupina].textAnchor
        },
        opacity: 0
      })

      changeCategoryLineLabel({
        svg,
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
        svg,
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
        svg,
        categoryName: category.skupina,
        delay: 700
      })
    }
  })

  activeCategoryNames.forEach(categoryName => {
    bringCategoryLineToFront({ svg, categoryName })  
  })
}

const changeCategoryLineLabel = ({ svg, categoryName, position, opacity = 1, duration = 0, delay = 0 }) => {
  const textToDisplay = categoryLineLabelTexts[categoryName] ? categoryLineLabelTexts[categoryName] : categoryName

  svg.select(`.g-line-labels .${kebabCase(categoryName)}`)
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

const addCategoryLineLabel = ({ svg, categoryName, position, opacity = 1 }) => {
  svg.select('.g-line-labels')
    .append('text')
    .attr('class', kebabCase(categoryName))

  changeCategoryLineLabel({ svg, categoryName, position, opacity })
}

const removeCategoryLineLabel = ({ svg, categoryName, delay = 0 }) => {
  svg.select(`.g-line-labels .${kebabCase(categoryName)}`)
    .transition()
    .duration(0)
    .delay(delay)
    .remove()
}

const isAddedCategoryLineLabel = ({ svg, categoryName }) => {
  return !svg.select(`.g-line-labels .${kebabCase(categoryName)}`).empty()
}

const changeCategoryLine = ({ svg, categoryName, d, style, activeColor, duration = 0, delay = 0 }) => {
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

  svg.select(`.g-lines .${kebabCase(categoryName)}`)
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

const bringCategoryLineToFront = ({ svg, categoryName }) => {
  svg.select(`.g-lines .${kebabCase(categoryName)}`)
    .raise()
}

const addCategoryLine = ({ svg, categoryName, d, style, activeColor }) => {
  svg.select('.g-lines')
    .append('path')
    .attr('class', kebabCase(categoryName))

  changeCategoryLine({ svg, categoryName, d, style, activeColor })
}

const removeCategoryLine = ({ svg, categoryName, delay = 0 }) => {
  svg.select(`.g-lines .${kebabCase(categoryName)}`)
    .transition()
    .duration(0)
    .delay(delay)
    .remove()
}
