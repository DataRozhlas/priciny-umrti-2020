import * as d3 from 'd3';

import * as axes from './axes';
import * as colors from './colors';
import * as legend from './legend';
import * as lines from './lines';
import * as xAxisAnnotations from './x_axis_annotations';

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

  const showLegendOnSide = width >= 768;

  // Prepare the margins
  let margin = { top: 60, right: 30, bottom: 100, left: 60 };
  let marginExplore = { ...margin, right: margin.right + 235 }; // legend on the right
  if (!showLegendOnSide) {
    margin = { top: 55, right: 20, bottom: 70, left: 55 };
    marginExplore = { ...margin /* bottom: margin.bottom + 40 */ }; // legend button on the bottom
  }

  svg.attr('viewBox', [0, 0, width, height]);

  const { data1919MzStd, data1919MStd, data1919ZStd } = data;
  const data1919MzStdWithoutTotal = data1919MzStd.filter((category) => category.skupina !== 'Celkem');

  // Prepare data functions

  const years = data1919MzStd[0].data.map((d) => d3.timeParse('%Y')(d.rok));

  const x = d3
    .scaleUtc()
    .domain(d3.extent(years))
    .range([margin.left, width - margin.right]);

  const xExplore = d3
    .scaleUtc()
    .domain(d3.extent(years))
    .range([marginExplore.left, width - marginExplore.right]);

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
    .range([height - marginExplore.bottom, marginExplore.top]);

  // Line functions

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

  // Put together viz object

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

    lineTotal,
    lineCategories,
    lineExplore,

    width,
    height,
    margin,
    marginExplore,

    showLegendOnSide,
  };

  // Axes

  axes.updateXAxis(viz, { x: viz.x, margin: viz.margin });
  axes.updateYAxis(viz, { y: viz.yTotal, margin: viz.margin });
  axes.createYAxisLabel(viz);

  // Lines

  lines.createLinesGroup(viz);

  const totalCategory = data1919MzStd.find((category) => category.skupina === 'Celkem');

  lines.addCategoryLine({
    svg,
    categoryName: 'Celkem',
    d: lineTotal(totalCategory.data),
    style: 'active',
    activeColor: colors.categoryColorsActive['Celkem'],
  });

  // Line labels

  lines.createLineLabelsGroup(viz);

  lines.addCategoryLineLabel({
    svg,
    categoryName: 'Celkem',
    position: {
      x: x(lines.categoryLineLabelPositions['Celkem'].x),
      y: yTotal(lines.categoryLineLabelPositions['Celkem'].y),
      textAnchor: lines.categoryLineLabelPositions['Celkem'].textAnchor,
    },
  });

  // X axis annotations

  xAxisAnnotations.createXAxisAnnotationsGroup(viz);

  return {
    destroy: () => {
      viz.svg.selectAll('*').remove();

      if (legend.isAddedLegend(viz)) {
        legend.removeLegend(viz);
      }
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
