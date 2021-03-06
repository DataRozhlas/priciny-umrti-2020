import * as d3 from 'd3';

import * as axes from './axes';
import * as colors from './colors';
import * as lines from './lines';

export default {
  onScrollDownToStep: (viz) => {
    const { svg, x, yTotal, lineTotal, lineCategories, data1919MzStd } = viz;

    const data1919MzStdWithoutTotal = data1919MzStd.filter((category) => category.skupina !== 'Celkem');
    const data1919MzStdCategoryTotal = data1919MzStd.find((category) => category.skupina === 'Celkem');

    // 1. Instantly remove the original total line

    lines.removeCategoryLine({ svg, categoryName: 'Celkem' });

    // 2. Instantly add all the category lines with the data of total

    data1919MzStdWithoutTotal.forEach((category) => {
      lines.addCategoryLine({
        svg,
        categoryName: category.skupina,
        // We start by rendering all the lines using the category total data
        // so we can then "break" that line using animation into the category-lines
        d: lineTotal(data1919MzStdCategoryTotal.data),
        style: 'active',
        activeColor: colors.categoryColorsActive['Celkem'],
      });
    });

    // 3. Animation part 1: "Break" the total line into category lines and fade away
    // the total line label

    data1919MzStdWithoutTotal.forEach((category) => {
      lines.changeCategoryLine({
        svg,
        categoryName: category.skupina,
        // We animate to the category data using the total scale
        d: lineTotal(category.data),
        duration: 700,
        style: 'anonymous',
      });
    });

    lines.changeCategoryLineLabel({
      svg,
      categoryName: 'Celkem',
      position: {
        x: x(lines.categoryLineLabelPositions['Celkem'].x),
        y: yTotal(lines.categoryLineLabelPositions['Celkem'].y),
        textAnchor: lines.categoryLineLabelPositions['Celkem'].textAnchor,
      },
      opacity: 0,
      duration: 700,
    });

    // 4. Animation part 2: Change the scale of Y axis and lines to match the categories

    axes.updateYAxis(viz, { y: viz.yCategories, margin: viz.margin, delay: 700 });

    data1919MzStdWithoutTotal.forEach((category) => {
      lines.changeCategoryLine({
        svg,
        categoryName: category.skupina,
        // We animate to the category data using the categories scale
        d: lineCategories(category.data),
        duration: 700,
        delay: 700,
        style: 'anonymous',
      });
    });
  },
  onScrollUpFromStep: (viz) => {
    const { svg, x, yTotal, lineTotal, data1919MzStd, margin } = viz;

    const data1919MzStdWithoutTotal = data1919MzStd.filter((category) => category.skupina !== 'Celkem');
    const data1919MzStdCategoryTotal = data1919MzStd.find((category) => category.skupina === 'Celkem');

    lines.addCategoryLine({
      svg,
      categoryName: 'Celkem',
      d: lineTotal(data1919MzStdCategoryTotal.data),
      style: 'active',
      activeColor: colors.categoryColorsActive['Celkem'],
    });

    lines.changeCategoryLineLabel({
      svg,
      categoryName: 'Celkem',
      position: {
        x: x(lines.categoryLineLabelPositions['Celkem'].x),
        y: yTotal(lines.categoryLineLabelPositions['Celkem'].y),
        textAnchor: lines.categoryLineLabelPositions['Celkem'].textAnchor,
      },
      opacity: 1,
    });

    data1919MzStdWithoutTotal.forEach((category) => {
      lines.removeCategoryLine({ svg, categoryName: category.skupina });
    });

    axes.updateYAxis(viz, { y: viz.yTotal, margin: viz.margin });
  },
};
