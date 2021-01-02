import * as axes from './axes';
import * as colors from './colors';
import * as lines from './lines';
import * as tooltip from './tooltip';

export default {
  onScrollDownToStep: (viz) => {
    // First remove the top two lines

    ['Nemoci oběhové soustavy', 'Novotvary'].forEach((categoryName) => {
      lines.removeCategoryLineLabel({ svg: viz.svg, categoryName });

      tooltip.removeCategoryLineTooltipTriggers(viz, { categoryName });

      lines.changeCategoryLine({
        svg: viz.svg,
        style: 'active',
        activeColor: 'transparent',
        categoryName,
        duration: 700,
      });
    });

    // Then update the Y axis together with all lines

    axes.updateYAxis(viz, { y: viz.yCategoriesLower, margin: viz.margin, delay: 700, duration: 700 });

    lines.changeActiveNonTotalCategoryLines(viz, {
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      activeCategoryNames: [],
      excludeCategoryNames: ['Nemoci oběhové soustavy', 'Novotvary'],
      delay: 700,
    });

    lines.changeActiveNonTotalCategoryLines(viz, {
      line: viz.lineCategoriesLower,
      x: viz.x,
      y: viz.yCategoriesLower,
      activeCategoryNames: ['Nemoci endokrinní, výživy a přeměny látek'],
      excludeCategoryNames: ['Nemoci oběhové soustavy', 'Novotvary'],
      delay: 1400,
    });
  },
  onScrollUpFromStep: (viz) => {
    axes.updateYAxis(viz, { y: viz.yCategories, margin: viz.margin, duration: 700 });

    lines.changeActiveNonTotalCategoryLines(viz, {
      line: viz.lineCategories,
      x: viz.x,
      y: viz.yCategories,
      activeCategoryNames: [],
      excludeCategoryNames: ['Nemoci oběhové soustavy', 'Novotvary'],
    });

    ['Nemoci oběhové soustavy', 'Novotvary'].forEach((categoryName) => {
      lines.changeCategoryLine({
        svg: viz.svg,
        d: viz.lineCategories(viz.dataMzStd.find((category) => category.skupina === categoryName).data),
        style: 'active',
        activeColor: 'transparent',
        categoryName,
        delay: 700,
      });

      lines.changeCategoryLine({
        svg: viz.svg,
        d: viz.lineCategories(viz.dataMzStd.find((category) => category.skupina === categoryName).data),
        style: categoryName === 'Novotvary' ? 'active' : 'context',
        activeColor: colors.categoryColorsActive[categoryName],
        categoryName,
        duration: 700,
        delay: 700,
      });
    });

    lines.addCategoryLineLabel({
      svg: viz.svg,
      categoryName: 'Novotvary',
      position: {
        x: viz.x(lines.categoryLineLabelPositions['Novotvary'].x),
        y: viz.yCategories(lines.categoryLineLabelPositions['Novotvary'].y),
        textAnchor: lines.categoryLineLabelPositions['Novotvary'].textAnchor,
      },
      opacity: 0,
    });

    lines.changeCategoryLineLabel({
      svg: viz.svg,
      categoryName: 'Novotvary',
      position: {
        x: viz.x(lines.categoryLineLabelPositions['Novotvary'].x),
        y: viz.yCategories(lines.categoryLineLabelPositions['Novotvary'].y),
        textAnchor: lines.categoryLineLabelPositions['Novotvary'].textAnchor,
      },
      opacity: 1,
      duration: 700,
      delay: 700,
    });

    tooltip.updateCategoryLineTooltipTriggers(viz, {
      categoryName: 'Novotvary',
      x: viz.x,
      y: viz.yCategories,
      activeColor: 'transparent',
    });

    tooltip.updateCategoryLineTooltipTriggers(viz, {
      categoryName: 'Novotvary',
      x: viz.x,
      y: viz.yCategories,
      activeColor: colors.categoryColorsActive['Novotvary'],
      duration: 700,
      delay: 700,
    });
  },
};
