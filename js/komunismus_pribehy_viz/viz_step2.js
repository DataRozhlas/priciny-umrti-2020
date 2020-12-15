import * as lines from './lines';

export default {
  onScrollDownToStep: ({ svg, x, yCategories, lineCategories, dataMzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      dataMzStd,
      activeCategoryNames: ['Zákonný zákrok a válečné operace', 'Ostatní vnější příčiny poranění a otrav'],
    });
  },
  onScrollUpFromStep: ({ svg, lineCategories, dataMzStd }) => {
    const dataMzStdWithoutTotal = dataMzStd.filter((category) => category.skupina !== 'Celkem');

    dataMzStdWithoutTotal.forEach((category) => {
      lines.changeCategoryLine({
        svg,
        categoryName: category.skupina,
        d: lineCategories(category.data),
        style: 'anonymous',
      });
    });

    lines.removeCategoryLineLabel({ svg, categoryName: 'Zákonný zákrok a válečné operace' });
    lines.removeCategoryLineLabel({ svg, categoryName: 'Ostatní vnější příčiny poranění a otrav' });
  },
};
