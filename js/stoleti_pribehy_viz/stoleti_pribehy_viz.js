import * as d3 from 'd3';

import * as axes from './axes';
import * as colors from './colors';
import * as legend from './legend';
import * as lines from './lines';
import * as xAxisAnnotations from './x_axis_annotations';

import vizStep1 from './viz_step1';

const vizSteps = {
  1: vizStep1,
};

export const initViz = (svgSelector, data) => {
  const svg = d3.select(svgSelector);

  const { width, height } = svg.node().parentNode.getBoundingClientRect();

  // Prepare the margins
  let margin = { top: 50, right: 30, bottom: 100, left: 50 };
  let marginExplore = { ...margin, right: margin.right + 235 }; // legend on the right
  if (!legend.showLegendOnSide({ width })) {
    margin = { top: 40, right: 20, bottom: 70, left: 40 };
    marginExplore = margin; // legend in dropdown in top right
  }

  svg.attr('viewBox', [0, 0, width, height]);

  const { dataLongMzStd } = data;
  const dataLongMzStdWithoutTotal = dataLongMzStd.filter((category) => category.skupina !== 'Celkem');

  // Prepare data functions

  const years = dataLongMzStd[0].data.map((d) => d3.timeParse('%Y')(d.rok));

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
    .domain([0, d3.max(dataLongMzStd.map((category) => d3.max(category.data.map((d) => d.value))))])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const yCategories = d3
    .scaleLinear()
    .domain([0, d3.max(dataLongMzStdWithoutTotal.map((category) => d3.max(category.data.map((d) => d.value))))])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const yExplore = d3
    .scaleLinear()
    .domain([0, d3.max(dataLongMzStdWithoutTotal.map((category) => d3.max(category.data.map((d) => d.value))))])
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

    dataLongMzStd,

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
  };

  // Axes

  axes.updateXAxis(viz, { x: viz.x, margin: viz.margin });
  axes.updateYAxis(viz, { y: viz.yTotal, margin: viz.margin });
  axes.createYAxisLabel(viz);

  // Lines

  lines.createLinesGroup(viz);

  const totalCategory = dataLongMzStd.find((category) => category.skupina === 'Celkem');

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

  // xAxisAnnotations.fadeInPragueSpringLine(viz, { xPos: viz.x(d3.timeParse('%Y')(1968)), margin: viz.margin });

  // xAxisAnnotations.fadeInPragueSpringLabel(viz, { xPos: viz.x(d3.timeParse('%Y')(1968)), margin: viz.margin });

  // xAxisAnnotations.fadeInVelvetRevolutionLine(viz, { xPos: viz.x(d3.timeParse('%Y')(1989)), margin: viz.margin });

  // xAxisAnnotations.fadeInVelvetRevolutionLabel(viz, { xPos: viz.x(d3.timeParse('%Y')(1989)), margin: viz.margin });

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
