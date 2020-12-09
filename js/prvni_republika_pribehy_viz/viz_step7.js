import * as d3 from 'd3'

import * as lines from './lines'

const vizStep7 = {
  onScrollDownToStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      data1919MzStd,
      activeCategoryNames: ['Válečné akce a soudní poprava']
    })

    svg.append('image')
      .attr('class', 'line-annotation-heydrich')
      .attr('x', x(d3.timeParse('%Y')(1942)) - 100 + 6)
      .attr('y', yCategories(35) - 60)
      .attr('width', 100)
      .attr('height', 60)
      .attr('href', 'assets/2_3_kompletni_priciny_umrti/valecne_akce_sipka_heydrichiada.svg')
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1)

    svg.append('image')
      .attr('class', 'line-annotation-freeing')
      .attr('x', x(d3.timeParse('%Y')(1945)) - 129 + 6)
      .attr('y', yCategories(165) - 63)
      .attr('width', 129)
      .attr('height', 63)
      .attr('href', 'assets/2_3_kompletni_priciny_umrti/valecne_akce_sipka_osvobozovaci_boje.svg')
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1)
  },
  onScrollUpFromStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      data1919MzStd,
      activeCategoryNames: ['Rakovina a jiné nádory', 'Nemoci ústrojí oběhu krevního']
    })

    svg.select('.line-annotation-heydrich').remove()
    svg.select('.line-annotation-freeing').remove()
  }
}

export default vizStep7
