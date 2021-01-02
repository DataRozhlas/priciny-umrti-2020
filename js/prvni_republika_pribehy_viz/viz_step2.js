import * as d3 from 'd3';

import * as lines from './lines';
import * as tooltip from './tooltip';

export default {
  onScrollDownToStep: (viz) => {
    lines.changeActiveNonTotalCategoryLines(viz, {
      line: viz.lineCategories,
      x: viz.x,
      y: viz.yCategories,
      activeCategoryNames: ['Stařecká sešlost'],
    });
  },
  onScrollUpFromStep: (viz) => {
    const dataMzStdWithoutTotal = viz.dataMzStd.filter((category) => category.skupina !== 'Celkem');

    dataMzStdWithoutTotal.forEach((category) => {
      lines.changeCategoryLine({
        svg: viz.svg,
        categoryName: category.skupina,
        d: viz.lineCategories(category.data),
        style: 'anonymous',
      });
    });

    lines.removeCategoryLineLabel({ svg: viz.svg, categoryName: 'Stařecká sešlost' });
    tooltip.removeCategoryLineTooltipTriggers(viz, { categoryName: 'Stařecká sešlost' });
  },
};
