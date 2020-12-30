import * as d3 from 'd3';

import * as axes from './axes';
import * as colors from './colors';
import * as legend from './legend';
import * as lines from './lines';
import * as tooltip from './tooltip';
import * as xAxisAnnotations from './x_axis_annotations';

export default {
  onScrollDownToStep: (viz) => {
    lines.removeCategoryLineLabel({ svg: viz.svg, categoryName: 'Dopravní nehody' });

    const exploreCategoryNames = ['Některé infekční a parazitární nemoci', 'Nemoci oběhové soustavy', 'Novotvary'];

    viz.dataMzStd.forEach((category) => {
      if (exploreCategoryNames.includes(category.skupina)) {
        lines.changeCategoryLine({
          svg: viz.svg,
          categoryName: category.skupina,
          d: viz.lineExplore(category.data),
          style: 'active',
          activeColor: colors.categoryColorsActive[category.skupina],
          duration: 700,
        });

        tooltip.updateCategoryLineTooltipTriggers(viz, {
          categoryName: category.skupina,
          x: viz.xExplore,
          y: viz.yExplore,
          activeColor: colors.categoryColorsActive[category.skupina],
        });
      } else {
        lines.removeCategoryLine({
          svg: viz.svg,
          categoryName: category.skupina,
        });
      }
    });

    axes.updateXAxis(viz, { x: viz.xExplore, margin: viz.marginExplore, duration: 700 });
    axes.updateYAxis(viz, { y: viz.yExplore, margin: viz.marginExplore, duration: 700 });

    xAxisAnnotations.updateCzechoslovakiaSplitLine(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1993)),
      margin: viz.marginExplore,
      duration: 700,
    });

    xAxisAnnotations.updateCzechoslovakiaSplitLabel(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1993)),
      margin: viz.marginExplore,
      duration: 700,
    });

    xAxisAnnotations.updateEuJoinedLine(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(2004)),
      margin: viz.marginExplore,
      duration: 700,
    });

    xAxisAnnotations.updateEuJoinedLabel(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(2004)),
      margin: viz.marginExplore,
      duration: 700,
    });

    legend.fadeInLegend(viz, { exploreCategoryNames });
  },
  onScrollUpFromStep: (viz) => {
    viz.dataMzStd.forEach((category) => {
      const categoryName = category.skupina;

      if (!lines.isAddedCategoryLine(viz, { categoryName })) {
        lines.addCategoryLine({
          svg: viz.svg,
          categoryName,
          d: viz.lineCategoriesLower(category.data),
          style: 'context',
        });
      } else {
        lines.changeCategoryLine({
          svg: viz.svg,
          categoryName,
          d: viz.lineCategoriesLower(category.data),
          style: 'context',
        });
      }

      tooltip.removeCategoryLineTooltipTriggers(viz, { categoryName });
    });

    lines.changeActiveNonTotalCategoryLines({
      svg: viz.svg,
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      dataMzStd: viz.dataMzStd,
      activeCategoryNames: ['Dopravní nehody'],
    });

    axes.updateXAxis(viz, { x: viz.x, margin: viz.margin, duration: 700 });
    axes.updateYAxis(viz, { y: viz.yCategoriesLower, margin: viz.margin, duration: 700 });

    xAxisAnnotations.updateCzechoslovakiaSplitLine(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1993)),
      margin: viz.margin,
      duration: 700,
    });

    xAxisAnnotations.updateCzechoslovakiaSplitLabel(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1993)),
      margin: viz.margin,
      duration: 700,
    });

    xAxisAnnotations.updateEuJoinedLine(viz, {
      xPos: viz.x(d3.timeParse('%Y')(2004)),
      margin: viz.margin,
      duration: 700,
    });

    xAxisAnnotations.updateEuJoinedLabel(viz, {
      xPos: viz.x(d3.timeParse('%Y')(2004)),
      margin: viz.margin,
      duration: 700,
    });

    legend.fadeOutLegend(viz);
    tooltip.hideTooltip();
  },
};
