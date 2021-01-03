import * as d3 from 'd3';

import * as axes from './axes';
import * as colors from './colors';
import * as legend from './legend';
import * as lines from './lines';
import * as tooltip from './tooltip';

export default {
  onScrollDownToStep: (viz) => {
    const dataMzStdWithoutTotal = viz.dataMzStd.filter((category) => category.skupina !== 'Celkem');
    const dataMzStdCategoryTotal = viz.dataMzStd.find((category) => category.skupina === 'Celkem');

    // 1. Instantly remove the original total line

    lines.removeCategoryLine({ svg: viz.svg, categoryName: 'Celkem' });

    // 2. Instantly add all the category lines with the data of total

    dataMzStdWithoutTotal.forEach((category) => {
      lines.addCategoryLine({
        svg: viz.svg,
        categoryName: category.skupina,
        // We start by rendering all the lines using the category total data
        // so we can then "break" that line using animation into the category-lines
        d: viz.lineTotal(dataMzStdCategoryTotal.data),
        style: 'active',
        activeColor: colors.categoryColorsActive['Celkem'],
      });
    });

    // 3. Animation part 1: "Break" the total line into category lines and fade away
    // the total line label

    dataMzStdWithoutTotal.forEach((category) => {
      lines.changeCategoryLine({
        svg: viz.svg,
        categoryName: category.skupina,
        // We animate to the category data using the total scale
        d: viz.lineTotal(category.data),
        duration: 700,
        style: 'anonymous',
      });
    });

    lines.changeCategoryLineLabel({
      svg: viz.svg,
      categoryName: 'Celkem',
      position: {
        x: viz.x(lines.categoryLineLabelPositions['Celkem'].x),
        y: viz.yTotal(lines.categoryLineLabelPositions['Celkem'].y),
        textAnchor: lines.categoryLineLabelPositions['Celkem'].textAnchor,
      },
      opacity: 0,
      duration: 700,
    });

    // 4. Animation part 2: Change the scale of Y axis and lines to match the categories

    axes.updateYAxis(viz, { y: viz.yCategories, margin: viz.margin, delay: 700 });

    dataMzStdWithoutTotal.forEach((category) => {
      lines.changeCategoryLine({
        svg: viz.svg,
        categoryName: category.skupina,
        // We animate to the category data using the categories scale
        d: viz.lineCategories(category.data),
        duration: 700,
        delay: 700,
        style: 'anonymous',
      });
    });

    // 5. Animation part 3: Add the legend and make lines active

    axes.updateXAxis(viz, { x: viz.xExplore, margin: viz.marginExplore, delay: 1400 });
    axes.updateYAxis(viz, { y: viz.yExplore, margin: viz.marginExplore, delay: 1400 });

    const exploreCategoryNames = ['Některé infekční a parazitární nemoci', 'Nemoci oběhové soustavy', 'Novotvary'];

    dataMzStdWithoutTotal.forEach((category) => {
      if (exploreCategoryNames.includes(category.skupina)) {
        lines.changeCategoryLine({
          svg: viz.svg,
          categoryName: category.skupina,
          // We animate to the category data using the categories scale
          d: viz.lineExplore(category.data),
          duration: 700,
          delay: 1400,
          style: 'active',
          activeColor: colors.categoryColorsActive[category.skupina],
        });

        tooltip.updateCategoryLineTooltipTriggers(viz, {
          categoryName: category.skupina,
          x: viz.xExplore,
          y: viz.yExplore,
          activeColor: 'transparent',
        });

        tooltip.updateCategoryLineTooltipTriggers(viz, {
          categoryName: category.skupina,
          x: viz.xExplore,
          y: viz.yExplore,
          activeColor: colors.categoryColorsActive[category.skupina],
          duration: 700,
          delay: 2100,
        });
      } else {
        lines.removeCategoryLine({
          svg: viz.svg,
          categoryName: category.skupina,
          delay: 1400,
        });
      }
    });

    legend.fadeInLegend(viz, { exploreCategoryNames });
  },
  onScrollUpFromStep: (viz) => {
    legend.fadeOutLegend(viz);
    tooltip.hideTooltip();

    const dataMzStdWithoutTotal = viz.dataMzStd.filter((category) => category.skupina !== 'Celkem');
    const dataMzStdCategoryTotal = viz.dataMzStd.find((category) => category.skupina === 'Celkem');

    lines.addCategoryLine({
      svg: viz.svg,
      categoryName: 'Celkem',
      d: viz.lineTotal(dataMzStdCategoryTotal.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Celkem'],
    });

    lines.changeCategoryLineLabel({
      svg: viz.svg,
      categoryName: 'Celkem',
      position: {
        x: viz.x(lines.categoryLineLabelPositions['Celkem'].x),
        y: viz.yTotal(lines.categoryLineLabelPositions['Celkem'].y),
        textAnchor: lines.categoryLineLabelPositions['Celkem'].textAnchor,
      },
      opacity: 1,
    });

    dataMzStdWithoutTotal.forEach((category) => {
      lines.removeCategoryLine({ svg: viz.svg, categoryName: category.skupina });
      tooltip.removeCategoryLineTooltipTriggers(viz, { categoryName: category.skupina });
    });

    axes.updateXAxis(viz, { x: viz.x, margin: viz.margin });
    axes.updateYAxis(viz, { y: viz.yTotal, margin: viz.margin });
  },
};
