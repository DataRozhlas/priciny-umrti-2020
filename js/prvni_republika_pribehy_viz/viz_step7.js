import * as d3 from 'd3';

import * as colors from './colors';
import * as lines from './lines';

export default {
  onScrollDownToStep: ({ svg, data1919MzStd, data1919MStd, data1919ZStd, x, yCategories, lineCategories }) => {
    const categoryWarName = 'Válečné akce a soudní poprava';

    const data1919MzStdCategoryWar = data1919MzStd.find((category) => category.skupina === categoryWarName);
    const data1919MStdCategoryWar = data1919MStd.find((category) => category.skupina === categoryWarName);
    const data1919ZStdCategoryWar = data1919ZStd.find((category) => category.skupina === categoryWarName);

    // 1. Instantly hide the men+women category war line and the label

    lines.changeCategoryLine({ svg, categoryName: 'Válečné akce a soudní poprava', style: 'active', opacity: 0 });

    lines.changeCategoryLineLabel({
      svg,
      categoryName: 'Válečné akce a soudní poprava',
      position: {
        x: x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava'].x),
        y: yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava'].textAnchor,
      },
      opacity: 0,
      duration: 700,
    });

    lines.removeCategoryLineLabel({
      svg,
      categoryName: 'Válečné akce a soudní poprava',
    });

    // 2. Instantly add separate men and women lines using the men+women data

    lines.addCategoryLine({
      svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      d: lineCategories(data1919MzStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava'],
    });
    lines.addCategoryLine({
      svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      d: lineCategories(data1919MzStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava'],
    });

    // 3. Break the men+women line to the separate lines using animation, add labels, and hide annotations

    lines.changeCategoryLine({
      svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      d: lineCategories(data1919MStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava - muži'],
      duration: 700,
    });
    lines.changeCategoryLine({
      svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      d: lineCategories(data1919ZStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava - ženy'],
      duration: 700,
    });

    lines.addCategoryLineLabel({
      svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      position: {
        x: x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
        y: yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor,
      },
      opacity: 0,
    });
    lines.changeCategoryLineLabel({
      svg,
      categoryName: 'Válečné akce a soudní poprava - muži',
      position: {
        x: x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].x),
        y: yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - muži'].textAnchor,
      },
      opacity: 1,
      duration: 700,
    });

    lines.addCategoryLineLabel({
      svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      position: {
        x: x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
        y: yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor,
      },
      opacity: 0,
    });
    lines.changeCategoryLineLabel({
      svg,
      categoryName: 'Válečné akce a soudní poprava - ženy',
      position: {
        x: x(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].x),
        y: yCategories(lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].y),
        textAnchor: lines.categoryLineLabelPositions['Válečné akce a soudní poprava - ženy'].textAnchor,
      },
      opacity: 1,
      duration: 700,
    });

    svg.select('.line-annotation-heydrich').transition().duration(700).attr('opacity', 0).remove();

    svg.select('.line-annotation-freeing').transition().duration(700).attr('opacity', 0).remove();
  },
  onScrollUpFromStep: ({ svg, data1919MzStd, x, yCategories, lineCategories }) => {
    lines.removeCategoryLine({ svg, categoryName: 'Válečné akce a soudní poprava - muži' });
    lines.removeCategoryLine({ svg, categoryName: 'Válečné akce a soudní poprava - ženy' });

    lines.removeCategoryLineLabel({ svg, categoryName: 'Válečné akce a soudní poprava - muži' });
    lines.removeCategoryLineLabel({ svg, categoryName: 'Válečné akce a soudní poprava - ženy' });

    const categoryWarName = 'Válečné akce a soudní poprava';
    const data1919MzStdCategoryWar = data1919MzStd.find((category) => category.skupina === categoryWarName);

    lines.changeCategoryLine({
      svg,
      categoryName: 'Válečné akce a soudní poprava',
      d: lineCategories(data1919MzStdCategoryWar.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Válečné akce a soudní poprava'],
    });

    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      data1919MzStd,
      activeCategoryNames: ['Válečné akce a soudní poprava'],
    });

    svg
      .append('image')
      .attr('class', 'line-annotation-heydrich')
      .attr('x', x(d3.timeParse('%Y')(1942)) - 93 + 6)
      .attr('y', yCategories(35) - 63)
      .attr('width', 93)
      .attr('height', 63)
      .attr('href', 'assets/2_3_kompletni_priciny_umrti/valecne_akce_sipka_heydrichiada.svg')
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    svg
      .append('image')
      .attr('class', 'line-annotation-freeing')
      .attr('x', x(d3.timeParse('%Y')(1945)) - 124 + 6)
      .attr('y', yCategories(165) - 64)
      .attr('width', 124)
      .attr('height', 64)
      .attr('href', 'assets/2_3_kompletni_priciny_umrti/valecne_akce_sipka_osvobozovaci_boje.svg')
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);
  },
};
