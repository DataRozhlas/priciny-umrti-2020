import * as d3 from 'd3';

import * as lines from './lines';

const vizStep3 = {
  onScrollDownToStep: ({ svg, x, yCategories, lineCategories, data1919MzStd }) => {
    lines.changeActiveNonTotalCategoryLines({
      svg,
      line: lineCategories,
      x,
      y: yCategories,
      data1919MzStd,
      activeCategoryNames: ['Stařecká sešlost'],
    });
  },
  onScrollUpFromStep: ({ svg, lineCategories, data1919MzStd }) => {
    const data1919MzStdWithoutTotal = data1919MzStd.filter((category) => category.skupina !== 'Celkem');

    data1919MzStdWithoutTotal.forEach((category) => {
      lines.changeCategoryLine({
        svg,
        categoryName: category.skupina,
        d: lineCategories(category.data),
        style: 'anonymous',
      });
    });

    lines.removeCategoryLineLabel({ svg, categoryName: 'Stařecká sešlost' });
  },
};

export default vizStep3;
