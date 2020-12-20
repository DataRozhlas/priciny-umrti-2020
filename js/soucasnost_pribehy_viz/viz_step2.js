import * as lines from './lines';

export default {
  onScrollDownToStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines({
      svg: viz.svg,
      line: viz.lineCategories,
      x: viz.x,
      y: viz.yCategories,
      dataMzStd: viz.dataMzStd,
      activeCategoryNames: ['Novotvary'],
    });
  },
  onScrollUpFromStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines({
      svg: viz.svg,
      line: viz.lineCategories,
      x: viz.x,
      y: viz.yCategories,
      dataMzStd: viz.dataMzStd,
      activeCategoryNames: ['Nemoci oběhové soustavy'],
    });
  },
};
