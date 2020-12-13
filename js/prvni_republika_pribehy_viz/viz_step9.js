import * as d3 from 'd3';

import * as axes from './axes';
import * as colors from './colors';
import * as legend from './legend';
import * as lines from './lines';
import * as xAxisAnnotations from './x_axis_annotations';

export default {
  onScrollDownToStep: (viz) => {
    const {
      svg,
      data1919MzStd,
      x,
      xExplore,
      yCategories,
      yExplore,
      xAxisExplore,
      yAxisExplore,
      lineCategories,
      lineExplore,
      showLegendOnSide,
      margin,
      width,
      height,
    } = viz;

    const data1919MzStdWithoutTotal = data1919MzStd.filter((category) => category.skupina !== 'Celkem');
    const data1919MzStdCategoryWar = data1919MzStd.find(
      (category) => category.skupina === 'Válečné akce a soudní poprava'
    );

    // 1. Animate the separate men and women category war lines together and fade away labels (and remove them)

    lines.changeCategoryLine({
      svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      d: lineCategories(data1919MzStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava'],
      duration: 700,
    });
    lines.changeCategoryLine({
      svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      d: lineCategories(data1919MzStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava'],
      duration: 700,
    });

    lines.changeCategoryLineLabel({
      svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      position: {
        x: x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
        y: yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor,
      },
      opacity: 0,
      duration: 700,
    });
    lines.removeCategoryLineLabel({ svg, categoryName: 'Válečné akce a soudní poprava - muži', delay: 700 });

    lines.changeCategoryLineLabel({
      svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      position: {
        x: x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
        y: yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor,
      },
      opacity: 0,
      duration: 700,
    });
    lines.removeCategoryLineLabel({ svg, categoryName: 'Válečné akce a soudní poprava - ženy', delay: 700 });

    // 2. Then instantly remove the separate lines and replace them with single men+women line again

    lines.removeCategoryLine({ svg, categoryName: 'Válečné akce a soudní poprava - muži', delay: 700 });
    lines.removeCategoryLine({ svg, categoryName: 'Válečné akce a soudní poprava - ženy', delay: 700 });

    lines.changeCategoryLine({
      svg,
      categoryName: 'Válečné akce a soudní poprava',
      d: lineCategories(data1919MzStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava'],
      opacity: 1,
      delay: 700,
    });

    // 3. And activate all the other lines

    data1919MzStdWithoutTotal.forEach((category) => {
      if (category.skupina !== 'Válečné akce a soudní poprava') {
        lines.changeCategoryLine({
          svg,
          categoryName: category.skupina,
          d: lineCategories(category.data),
          style: 'active',
          activeColor: colors.categoryColorsActive[category.skupina],
          duration: 700,
        });
      }
    });

    // 4.

    data1919MzStdWithoutTotal.forEach((category) => {
      lines.changeCategoryLine({
        svg,
        categoryName: category.skupina,
        d: lineExplore(category.data),
        style: 'active',
        activeColor: colors.categoryColorsActive[category.skupina],
        delay: 700,
        duration: 700,
      });
    });

    axes.updateXAxis(viz, { x: viz.xExplore, margin: viz.marginExplore, delay: 700, duration: 700 });
    axes.updateYAxis(viz, { y: viz.yExplore, margin: viz.marginExplore, delay: 700, duration: 700 });

    xAxisAnnotations.updateFirstRepublicLabel(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1929)),
      margin: viz.marginExplore,
      delay: 700,
      duration: 700,
    });

    xAxisAnnotations.updateSecondWWBand(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1939)),
      bandWidth: viz.xExplore(d3.timeParse('%Y')(1945)) - viz.xExplore(d3.timeParse('%Y')(1939)),
      margin: viz.marginExplore,
      delay: 700,
      duration: 700,
    });

    xAxisAnnotations.updateSecondWWLabel(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1942)),
      margin: viz.marginExplore,
      delay: 700,
      duration: 700,
    });

    xAxisAnnotations.updateCommunistCoupLine(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1948)),
      margin: viz.marginExplore,
      delay: 700,
      duration: 700,
    });

    xAxisAnnotations.updateCommunistCoupLabel(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1948)),
      margin: viz.marginExplore,
      delay: 700,
      duration: 700,
    });

    legend.fadeInLegend(viz);
  },
  onScrollUpFromStep: (viz) => {
    const { svg, data1919MzStd, data1919MStd, data1919ZStd, x, yCategories, lineCategories } = viz;

    const data1919MzStdWithoutTotal = data1919MzStd.filter((category) => category.skupina !== 'Celkem');

    const categoryWarName = 'Válečné akce a soudní poprava';

    const data1919MStdCategoryWar = data1919MStd.find((category) => category.skupina === categoryWarName);
    const data1919ZStdCategoryWar = data1919ZStd.find((category) => category.skupina === categoryWarName);

    data1919MzStdWithoutTotal.forEach((category) => {
      const categoryName = category.skupina;

      if (!lines.isAddedCategoryLine(viz, { categoryName })) {
        lines.addCategoryLine({
          svg,
          categoryName,
          d: lineCategories(category.data),
          style: 'context',
        });
      } else {
        lines.changeCategoryLine({
          svg,
          categoryName,
          d: lineCategories(category.data),
          style: 'context',
        });
      }
    });

    lines.changeCategoryLine({ svg, categoryName: categoryWarName, style: 'active', opacity: 0 });

    lines.addCategoryLine({
      svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      d: lineCategories(data1919MStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava - muži'],
    });
    lines.addCategoryLine({
      svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      d: lineCategories(data1919ZStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava - ženy'],
    });

    lines.addCategoryLineLabel({
      svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      position: {
        x: x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
        y: yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor,
      },
    });
    lines.addCategoryLineLabel({
      svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      position: {
        x: x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
        y: yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor,
      },
    });

    axes.updateXAxis(viz, { x: viz.x, margin: viz.margin, duration: 700 });
    axes.updateYAxis(viz, { y: viz.yCategories, margin: viz.margin, duration: 700 });

    xAxisAnnotations.updateFirstRepublicLabel(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1929)),
      margin: viz.margin,
      duration: 700,
    });

    xAxisAnnotations.updateSecondWWBand(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1939)),
      bandWidth: viz.x(d3.timeParse('%Y')(1945)) - viz.x(d3.timeParse('%Y')(1939)),
      margin: viz.margin,
      duration: 700,
    });

    xAxisAnnotations.updateSecondWWLabel(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1942)),
      margin: viz.margin,
      duration: 700,
    });

    xAxisAnnotations.updateCommunistCoupLine(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1948)),
      margin: viz.margin,
      duration: 700,
    });

    xAxisAnnotations.updateCommunistCoupLabel(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1948)),
      margin: viz.margin,
      duration: 700,
    });

    legend.fadeOutLegend(viz);
  },
};
