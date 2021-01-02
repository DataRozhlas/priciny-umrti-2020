import * as d3 from 'd3';

import * as lines from './lines';

export default {
  onScrollDownToStep: (viz) => {
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
      .attr(
        'href',
        `${window.dataRozhlasBaseUrl}assets/2_3_kompletni_priciny_umrti/valecne_akce_sipka_heydrichiada.svg`
      )
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
      .attr(
        'href',
        `${window.dataRozhlasBaseUrl}assets/2_3_kompletni_priciny_umrti/valecne_akce_sipka_osvobozovaci_boje.svg`
      )
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);
  },
  onScrollUpFromStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines(viz, {
      line: viz.lineCategories,
      x: viz.x,
      y: viz.yCategories,
      activeCategoryNames: ['Rakovina a jiné nádory', 'Nemoci ústrojí oběhu krevního'],
    });

    viz.svg.select('.line-annotation-heydrich').remove();
    viz.svg.select('.line-annotation-freeing').remove();
  },
};
