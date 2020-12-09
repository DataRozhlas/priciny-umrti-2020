import * as d3 from 'd3'

import * as lines from './lines'

const vizStep6 = {
  onScrollDownToStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      data1919MzStd,
      activeCategoryNames: ['Rakovina a jiné nádory', 'Nemoci ústrojí oběhu krevního']
    })
  },
  onScrollUpFromStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      data1919MzStd,
      activeCategoryNames: ['Nemoci nakažlivé a cizopasné', 'Nemoci ústrojí oběhu krevního']
    })
  }
}

export default vizStep6
