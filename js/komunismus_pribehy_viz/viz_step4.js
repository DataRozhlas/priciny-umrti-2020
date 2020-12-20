import * as lines from './lines';

export default {
  onScrollDownToStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines({
      svg: viz.svg,
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      dataMzStd: viz.dataMzStdCategoriesLower,
      activeCategoryNames: ['Některé infekční a parazitární nemoci'],
    });
  },
  onScrollUpFromStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines({
      svg: viz.svg,
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      dataMzStd: viz.dataMzStdCategoriesLower,
      activeCategoryNames: ['Úmyslné sebepoškození'],
    });
  },
};
