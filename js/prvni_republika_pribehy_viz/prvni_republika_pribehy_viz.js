import * as d3 from 'd3';

import * as axes from './axes';
import * as colors from './colors';
import * as legend from './legend';
import * as lines from './lines';
import * as tooltip from './tooltip';
import * as xAxisAnnotations from './x_axis_annotations';

import vizStep1 from './viz_step1';
import vizStep2 from './viz_step2';
import vizStep3 from './viz_step3';
import vizStep4 from './viz_step4';
import vizStep5 from './viz_step5';
import vizStep6 from './viz_step6';
import vizStep7 from './viz_step7';
import vizStep8 from './viz_step8';

const vizSteps = {
  1: vizStep1,
  2: vizStep2,
  3: vizStep3,
  4: vizStep4,
  5: vizStep5,
  6: vizStep6,
  7: vizStep7,
  8: vizStep8,
};

export const initViz = (svgSelector, data) => {
  const svg = d3.select(svgSelector);

  const { width: stickyWidth, height: stickyHeight } = svg.node().parentNode.getBoundingClientRect();

  const width = stickyWidth;
  const height = Math.min(stickyHeight, 1000);

  // Prepare the margins
  let margin = { top: 50, right: 30, bottom: 100, left: 50 };
  let marginExplore = { ...margin, right: margin.right + 255 }; // legend on the right
  if (!legend.showLegendOnSide({ width })) {
    margin = { top: 50, right: 20, bottom: 70, left: 40 };
    marginExplore = margin; // legend in dropdown in top right
  }

  svg.attr('viewBox', [0, 0, width, height]);

  const { data1919MzStd, data1919MStd, data1919ZStd, data1919MzAbs, dataTooltip1948 } = data;
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

    dataMzStd: data1919MzStd,
    dataMStd: data1919MStd,
    dataZStd: data1919ZStd,

    tooltipData: tooltip.prepareTooltipData({ dataMzAbs: data1919MzAbs, dataTooltip: dataTooltip1948 }),

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

  xAxisAnnotations.fadeInFirstRepublicLabel(viz, { xPos: viz.x(d3.timeParse('%Y')(1929)), margin: viz.margin });

  xAxisAnnotations.fadeInSecondWWBand(viz, {
    xPos: viz.x(d3.timeParse('%Y')(1939)),
    bandWidth: viz.x(d3.timeParse('%Y')(1945)) - viz.x(d3.timeParse('%Y')(1939)),
    margin: viz.margin,
  });

  xAxisAnnotations.fadeInSecondWWLabel(viz, { xPos: viz.x(d3.timeParse('%Y')(1942)), margin: viz.margin });

  xAxisAnnotations.fadeInCommunistCoupLine(viz, { xPos: viz.x(d3.timeParse('%Y')(1948)), margin: viz.margin });

  xAxisAnnotations.fadeInCommunistCoupLabel(viz, { xPos: viz.x(d3.timeParse('%Y')(1948)), margin: viz.margin });

  // Tooltip

  tooltip.createTooltipTriggersGroup(viz);

  return {
    destroy: () => {
      viz.svg.selectAll('*').remove();

      if (legend.isAddedLegend(viz)) {
        legend.removeLegend(viz);
      }

      tooltip.hideTooltip();
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
