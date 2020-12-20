import * as d3 from 'd3';

import * as axes from './axes';
import * as colors from './colors';
import * as legend from './legend';
import * as lines from './lines';
import * as xAxisAnnotations from './x_axis_annotations';

export default {
  onScrollDownToStep: (viz) => {
    lines.removeCategoryLineLabel({ svg: viz.svg, categoryName: 'Některé stavy vzniklé v perinatálním období' });
    lines.removeCategoryLineLabel({ svg: viz.svg, categoryName: 'Těhotenství, porod a šestinedělí' });

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
      } else {
        lines.removeCategoryLine({
          svg: viz.svg,
          categoryName: category.skupina,
        });
      }
    });

    axes.updateXAxis(viz, { x: viz.xExplore, margin: viz.marginExplore, duration: 700 });
    axes.updateYAxis(viz, { y: viz.yExplore, margin: viz.marginExplore, duration: 700 });

    xAxisAnnotations.updatePragueSpringLine(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1968)),
      margin: viz.marginExplore,
      duration: 700,
    });

    xAxisAnnotations.updatePragueSpringLabel(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1968)),
      margin: viz.marginExplore,
      duration: 700,
    });

    xAxisAnnotations.updateVelvetRevolutionLine(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1989)),
      margin: viz.marginExplore,
      duration: 700,
    });

    xAxisAnnotations.updateVelvetRevolutionLabel(viz, {
      xPos: viz.xExplore(d3.timeParse('%Y')(1989)),
      margin: viz.marginExplore,
      duration: 700,
    });

    legend.fadeInLegend(viz, { exploreCategoryNames });
  },
  onScrollUpFromStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines({
      svg: viz.svg,
      line: viz.lineCategories,
      x: viz.x,
      y: viz.yCategories,
      dataMzStd: viz.dataMzStd,
      activeCategoryNames: ['Některé stavy vzniklé v perinatálním období', 'Těhotenství, porod a šestinedělí'],
    });

    viz.dataMzStd.forEach((category) => {
      const categoryName = category.skupina;

      if (!lines.isAddedCategoryLine(viz, { categoryName })) {
        lines.addCategoryLine({
          svg: viz.svg,
          categoryName,
          d: viz.lineCategories(category.data),
          style: 'context',
        });
      } else {
        lines.changeCategoryLine({
          svg: viz.svg,
          categoryName,
          d: viz.lineCategories(category.data),
          style: 'context',
        });
      }
    });

    axes.updateXAxis(viz, { x: viz.x, margin: viz.margin, duration: 700 });
    axes.updateYAxis(viz, { y: viz.yCategories, margin: viz.margin, duration: 700 });

    xAxisAnnotations.updatePragueSpringLine(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1968)),
      margin: viz.margin,
      duration: 700,
    });

    xAxisAnnotations.updatePragueSpringLabel(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1968)),
      margin: viz.margin,
      duration: 700,
    });

    xAxisAnnotations.updateVelvetRevolutionLine(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1989)),
      margin: viz.margin,
      duration: 700,
    });

    xAxisAnnotations.updateVelvetRevolutionLabel(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1989)),
      margin: viz.margin,
      duration: 700,
    });

    legend.fadeOutLegend(viz);
  },
};