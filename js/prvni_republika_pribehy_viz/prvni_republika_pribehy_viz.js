import * as d3 from 'd3';

import * as colors from './colors';
import * as lines from './lines';

import vizStep1 from './viz_step1';
import vizStep2 from './viz_step2';
import vizStep3 from './viz_step3';
import vizStep4 from './viz_step4';
import vizStep5 from './viz_step5';
import vizStep6 from './viz_step6';
import vizStep7 from './viz_step7';
import vizStep8 from './viz_step8';
import vizStep9 from './viz_step9';

const vizSteps = {
  1: vizStep1,
  2: vizStep2,
  3: vizStep3,
  4: vizStep4,
  5: vizStep5,
  6: vizStep6,
  7: vizStep7,
  8: vizStep8,
  9: vizStep9,
};

export const initViz = (svgSelector, data) => {
  const svg = d3.select(svgSelector);

  // We want the parent div of the svg to get the available space
  const { width, height } = svg.node().parentNode.getBoundingClientRect();

  const margin =
    width < 768 ? { top: 55, right: 20, bottom: 70, left: 55 } : { top: 60, right: 30, bottom: 100, left: 60 };

  const showLegendOnSide = width >= 768;

  svg.attr('viewBox', [0, 0, width, height]);

  const { data1919MzStd, data1919MStd, data1919ZStd } = data;
  const data1919MzStdWithoutTotal = data1919MzStd.filter((category) => category.skupina !== 'Celkem');

  // 1. Prepare data functions

  const years = data1919MzStd[0].data.map((d) => d3.timeParse('%Y')(d.rok));

  const x = d3
    .scaleUtc()
    .domain(d3.extent(years))
    .range([margin.left, width - margin.right]);

  const xExplore = d3
    .scaleUtc()
    .domain(d3.extent(years))
    .range([margin.left, width - margin.right - (showLegendOnSide ? 250 : 0)]);

  const yTotal = d3
    .scaleLinear()
    .domain([0, d3.max(data1919MzStd.map((category) => d3.max(category.data.map((d) => d.value))))])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const yCategories = d3
    .scaleLinear()
    .domain([0, d3.max(data1919MzStdWithoutTotal.map((category) => d3.max(category.data.map((d) => d.value))))])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const yExplore = d3
    .scaleLinear()
    .domain([0, d3.max(data1919MzStdWithoutTotal.map((category) => d3.max(category.data.map((d) => d.value))))])
    .nice()
    .range([height - margin.bottom - (showLegendOnSide ? 0 : 40), margin.top]);

  // 2. Axes

  const yAxis = (g) =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yTotal))
      // Remove the axis line to make the chart lighter
      .call((g) => g.select('.domain').attr('stroke-width', 0));

  const yAxisExplore = (g) =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yExplore))
      // Remove the axis line to make the chart lighter
      .call((g) => g.select('.domain').attr('stroke-width', 0));

  const xAxis = (g) =>
    g.attr('transform', `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(x)
        .ticks(d3.timeYear.every(width < 768 ? 5 : 1))
        .tickSizeOuter(0)
        .tickFormat(d3.timeFormat('%Y'))
    );

  const xAxisExplore = (g) =>
    g.attr('transform', `translate(0,${height - margin.bottom - (showLegendOnSide ? 0 : 40)})`).call(
      d3
        .axisBottom(xExplore)
        .ticks(d3.timeYear.every(width < 768 ? 5 : 2))
        .tickSizeOuter(0)
        .tickFormat(d3.timeFormat('%Y'))
    );

  svg.append('g').attr('class', 'g-axis-x').call(xAxis);

  svg.append('g').attr('class', 'g-axis-y').call(yAxis);

  const svgAxesLabelsG = svg.append('g').attr('class', 'g-axes-labels');

  const axisXLabel = svgAxesLabelsG
    .append('text')
    .attr('class', 'axis-x-label')
    .attr('y', margin.top - 45)
    .attr('text-anchor', 'end');

  axisXLabel.append('tspan').text('Úmrtí na').attr('x', margin.left);
  axisXLabel.append('tspan').text('100 tisíc').attr('dy', 14).attr('x', margin.left);
  axisXLabel.append('tspan').text('(std. 1948)').attr('dy', 14).attr('x', margin.left);

  // 3. Lines

  const lineTotal = d3
    .line()
    .x((d) => x(d3.timeParse('%Y')(d.rok)))
    .y((d) => yTotal(d.value ? d.value : 0));

  const lineCategories = d3
    .line()
    .x((d) => x(d3.timeParse('%Y')(d.rok)))
    .y((d) => yCategories(d.value ? d.value : 0));

  const lineExplore = d3
    .line()
    .x((d) => xExplore(d3.timeParse('%Y')(d.rok)))
    .y((d) => yExplore(d.value ? d.value : 0));

  svg.append('g').attr('class', 'g-lines');

  const totalCategory = data1919MzStd.find((category) => category.skupina === 'Celkem');

  lines.addCategoryLine({
    svg,
    categoryName: 'Celkem',
    d: lineTotal(totalCategory.data),
    style: 'active',
    activeColor: colors.categoryColorsActive['Celkem'],
  });

  // 4. Labels

  svg.append('g').attr('class', 'g-line-labels');

  lines.addCategoryLineLabel({
    svg,
    categoryName: 'Celkem',
    position: {
      x: x(lines.categoryLineLabelPositions['Celkem'].x),
      y: yTotal(lines.categoryLineLabelPositions['Celkem'].y),
      textAnchor: lines.categoryLineLabelPositions['Celkem'].textAnchor,
    },
  });

  const viz = {
    svg,

    data1919MzStd,
    data1919MStd,
    data1919ZStd,

    x,
    xExplore,

    yTotal,
    yCategories,
    yExplore,

    yAxis,
    yAxisExplore,

    xAxis,
    xAxisExplore,

    lineTotal,
    lineCategories,
    lineExplore,

    width,
    height,
    margin,

    showLegendOnSide,
  };

  return {
    destroy: () => {
      svg.selectAll('*').remove();
    },
    onScrollDownToStep: (stepIndex) => {
      if (vizSteps[stepIndex] && vizSteps[stepIndex].onScrollDownToStep) {
        vizSteps[stepIndex].onScrollDownToStep(viz);
      }
    },
    onScrollUpFromStep: (stepIndex) => {
      if (vizSteps[stepIndex] && vizSteps[stepIndex].onScrollUpFromStep) {
        vizSteps[stepIndex].onScrollUpFromStep(viz);
      }
    },
  };
};
