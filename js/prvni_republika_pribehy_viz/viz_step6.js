import * as d3 from 'd3';

import * as lines from './lines';

export default {
  onScrollDownToStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
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
      .attr(
        'href',
        `${window.dataRozhlasBaseUrl}assets/2_3_kompletni_priciny_umrti/valecne_akce_sipka_heydrichiada.svg`
      )
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
      .attr(
        'href',
        `${window.dataRozhlasBaseUrl}assets/2_3_kompletni_priciny_umrti/valecne_akce_sipka_osvobozovaci_boje.svg`
      )
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);
  },
  onScrollUpFromStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      data1919MzStd,
      activeCategoryNames: ['Rakovina a jiné nádory', 'Nemoci ústrojí oběhu krevního'],
    });

    svg.select('.line-annotation-heydrich').remove();
    svg.select('.line-annotation-freeing').remove();
  },
};
