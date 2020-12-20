import * as lines from './lines';

export default {
  onScrollDownToStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines({
      svg: viz.svg,
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      dataMzStd: viz.dataMzStdCategoriesLower,
      activeCategoryNames: ['Úmyslné sebepoškození'],
    });
  },
  onScrollUpFromStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines({
      svg: viz.svg,
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      dataMzStd: viz.dataMzStdCategoriesLower,
      activeCategoryNames: [
        'Zákonný zákrok a válečné operace',
        'Ostatní vnější příčiny poranění a otrav',
        'Úmyslné sebepoškození',
      ],
    });
  },
};
