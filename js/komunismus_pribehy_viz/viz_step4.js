import * as lines from './lines';

export default {
  onScrollDownToStep: ({ svg, x, yCategories, lineCategories, dataMzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      dataMzStd,
      activeCategoryNames: ['Úmyslné sebepoškození'],
    });
  },
  onScrollUpFromStep: ({ svg, x, yCategories, lineCategories, dataMzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      dataMzStd,
      activeCategoryNames: ['Některé infekční a parazitární nemoci'],
    });
  },
};
