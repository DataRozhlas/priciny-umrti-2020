import * as lines from './lines';

export default {
  onScrollDownToStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines(viz, {
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      activeCategoryNames: ['Dopravní nehody'],
      excludeCategoryNames: ['Nemoci oběhové soustavy', 'Novotvary'],
    });
  },
  onScrollUpFromStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines(viz, {
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      activeCategoryNames: ['Úmyslné sebepoškození'],
      excludeCategoryNames: ['Nemoci oběhové soustavy', 'Novotvary'],
    });
  },
};
