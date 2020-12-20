import * as lines from './lines';

export default {
  onScrollDownToStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines({
      svg: viz.svg,
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      dataMzStd: viz.dataMzStdCategoriesLower,
      activeCategoryNames: ['Napadení (útok)'],
    });
  },
  onScrollUpFromStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines({
      svg: viz.svg,
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      dataMzStd: viz.dataMzStdCategoriesLower,
      activeCategoryNames: ['Dopravní nehody'],
    });
  },
};
