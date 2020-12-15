import * as lines from './lines';

export default {
  onScrollDownToStep: ({ svg, x, yCategories, lineCategories, dataMzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      dataMzStd,
      activeCategoryNames: ['Nemoci oběhové soustavy'],
    });
  },
  onScrollUpFromStep: ({ svg, x, yCategories, lineCategories, dataMzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      dataMzStd,
      activeCategoryNames: ['Dopravní nehody'],
    });
  },
};
