import * as d3 from 'd3';

import * as colors from './colors';
import * as lines from './lines';
import * as tooltip from './tooltip';

export default {
  onScrollDownToStep: (viz) => {
    const categoryWarName = 'Válečné akce a soudní poprava';

    const dataMzStdCategoryWar = viz.dataMzStd.find((category) => category.skupina === categoryWarName);
    const dataMStdCategoryWar = viz.dataMStd.find((category) => category.skupina === categoryWarName);
    const dataZStdCategoryWar = viz.dataZStd.find((category) => category.skupina === categoryWarName);

    // 1. Instantly hide the men+women category war line and the label

    lines.changeCategoryLine({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava',
      style: 'active',
      opacity: 0,
    });

    lines.changeCategoryLineLabel({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava',
      position: {
        x: viz.x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava'].x),
        y: viz.yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava'].textAnchor,
      },
      opacity: 0,
      duration: 700,
    });

    lines.removeCategoryLineLabel({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava',
    });

    tooltip.removeCategoryLineTooltipTriggers(viz, { categoryName: 'Válečné akce a soudní poprava' });

    // 2. Instantly add separate men and women lines using the men+women data

    lines.addCategoryLine({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      d: viz.lineCategories(dataMzStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava'],
    });
    lines.addCategoryLine({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      d: viz.lineCategories(dataMzStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava'],
    });

    // 3. Break the men+women line to the separate lines using animation, add labels, and hide annotations

    lines.changeCategoryLine({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      d: viz.lineCategories(dataMStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava - muži'],
      duration: 700,
    });
    lines.changeCategoryLine({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      d: viz.lineCategories(dataZStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava - ženy'],
      duration: 700,
    });

    lines.addCategoryLineLabel({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      position: {
        x: viz.x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
        y: viz.yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor,
      },
      opacity: 0,
    });
    lines.changeCategoryLineLabel({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      position: {
        x: viz.x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
        y: viz.yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor,
      },
      opacity: 1,
      duration: 700,
    });

    lines.addCategoryLineLabel({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      position: {
        x: viz.x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
        y: viz.yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor,
      },
      opacity: 0,
    });
    lines.changeCategoryLineLabel({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      position: {
        x: viz.x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
        y: viz.yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor,
      },
      opacity: 1,
      duration: 700,
    });

    viz.svg.select('.line-annotation-heydrich').transition().duration(700).attr('opacity', 0).remove();

    viz.svg.select('.line-annotation-freeing').transition().duration(700).attr('opacity', 0).remove();
  },
  onScrollUpFromStep: (viz) => {
    lines.removeCategoryLine({ svg: viz.svg, categoryName: 'Válečné akce a soudní poprava - muži' });
    lines.removeCategoryLine({ svg: viz.svg, categoryName: 'Válečné akce a soudní poprava - ženy' });

    lines.removeCategoryLineLabel({ svg: viz.svg, categoryName: 'Válečné akce a soudní poprava - muži' });
    lines.removeCategoryLineLabel({ svg: viz.svg, categoryName: 'Válečné akce a soudní poprava - ženy' });

    const categoryWarName = 'Válečné akce a soudní poprava';
    const dataMzStdCategoryWar = viz.dataMzStd.find((category) => category.skupina === categoryWarName);

    lines.changeCategoryLine({
      svg: viz.svg,
      categoryName: 'Válečné akce a soudní poprava',
      d: viz.lineCategories(dataMzStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava'],
    });

    lines.changeActiveNonTotalCategoryLines(viz, {
      line: viz.lineCategories,
      x: viz.x,
      y: viz.yCategories,
      activeCategoryNames: ['Válečné akce a soudní poprava'],
    });

    viz.svg
      .append('image')
      .attr('class', 'line-annotation-heydrich')
      .attr('x', viz.x(d3.timeParse('%Y')(1942)) - 93 + 6)
      .attr('y', viz.yCategories(35) - 63)
      .attr('width', 93)
      .attr('height', 63)
      .attr('href', 'assets/2_3_kompletni_priciny_umrti/valecne_akce_sipka_heydrichiada.svg')
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    viz.svg
      .append('image')
      .attr('class', 'line-annotation-freeing')
      .attr('x', viz.x(d3.timeParse('%Y')(1945)) - 124 + 6)
      .attr('y', viz.yCategories(165) - 64)
      .attr('width', 124)
      .attr('height', 64)
      .attr('href', 'assets/2_3_kompletni_priciny_umrti/valecne_akce_sipka_osvobozovaci_boje.svg')
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);
  },
};
