import * as d3 from 'd3';

import * as lines from './lines';

export default {
  onScrollDownToStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines(viz, {
      line: viz.lineCategories,
      x: viz.x,
      y: viz.yCategories,
      activeCategoryNames: ['Rakovina a jiné nádory', 'Nemoci ústrojí oběhu krevního'],
    });
  },
  onScrollUpFromStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines(viz, {
      line: viz.lineCategories,
      x: viz.x,
      y: viz.yCategories,
      activeCategoryNames: ['Nemoci nakažlivé a cizopasné', 'Nemoci ústrojí oběhu krevního'],
    });
  },
};
