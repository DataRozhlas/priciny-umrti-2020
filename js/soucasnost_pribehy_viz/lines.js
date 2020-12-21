import * as d3 from 'd3';
import kebabCase from 'lodash/kebabCase';

import * as colors from './colors';
import * as texts from './texts';

export const createLinesGroup = (viz) => {
  viz.svg.append('g').attr('class', 'g-lines');
};

export const createLineLabelsGroup = (viz) => {
  viz.svg.append('g').attr('class', 'g-line-labels');
};

export const changeCategoryLine = ({ svg, categoryName, d, style, activeColor, duration = 0, delay = 0 }) => {
  let stroke;
  let strokeWidth;
  if (style === 'context') {
    stroke = '#E1E2DF';
    strokeWidth = 1;
  } else if (style === 'anonymous') {
    stroke = '#aaaaaa';
    strokeWidth = 2;
  } else if (style === 'active') {
    stroke = activeColor;
    strokeWidth = 2;
  } else {
    throw new Error(`Unknown category line style: ${style}`);
  }

  const line = svg.select(`.g-lines .${kebabCase(categoryName)}`);

  line
    .transition()
    .duration(duration)
    .delay(delay)
    .attr('d', d !== undefined ? d : line.attr('d'))
    .attr('stroke', stroke)
    .attr('stroke-width', strokeWidth)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('fill', 'none');
};

export const changeCategoryLineStyle = (viz, { categoryName, style, activeColor }) => {
  let stroke;
  let strokeWidth;
  if (style === 'context') {
    stroke = '#E1E2DF';
    strokeWidth = 1;
  } else if (style === 'anonymous') {
    stroke = '#aaaaaa';
    strokeWidth = 2;
  } else if (style === 'active') {
    stroke = activeColor;
    strokeWidth = 2;
  } else {
    throw new Error(`Unknown category line style: ${style}`);
  }

  const line = viz.svg.select(`.g-lines .${kebabCase(categoryName)}`);

  line.attr('stroke', stroke).attr('stroke-width', strokeWidth);
};

export const bringCategoryLineToFront = ({ svg, categoryName }) => {
  svg.select(`.g-lines .${kebabCase(categoryName)}`).raise();
};

export const addCategoryLine = ({ svg, categoryName, d, style, activeColor, duration = 0, delay = 0 }) => {
  svg.select('.g-lines').append('path').attr('class', kebabCase(categoryName));

  changeCategoryLine({
    svg,
    categoryName,
    d,
    style,
    activeColor,
    duration,
    delay,
  });
};

export const removeCategoryLine = ({ svg, categoryName, delay = 0 }) => {
  svg
    .select(`.g-lines .${kebabCase(categoryName)}`)
    .transition()
    .duration(0)
    .delay(delay)
    .remove();
};

export const isAddedCategoryLine = (viz, { categoryName }) => {
  return !viz.svg.select(`.g-lines .${kebabCase(categoryName)}`).empty();
};

export const changeCategoryLineLabel = ({ svg, categoryName, position, opacity = 1, duration = 0, delay = 0 }) => {
  const textToDisplay = categoryLineLabelTexts[categoryName]
    ? categoryLineLabelTexts[categoryName]
    : texts.categoriesShortLabels[categoryName];

  svg
    .select(`.g-line-labels .${kebabCase(categoryName)}`)
    .transition()
    .duration(duration)
    .delay(delay)
    .text(textToDisplay)
    .attr('x', position.x)
    .attr('y', position.y)
    .attr('text-anchor', position.textAnchor)
    .attr('fill', colors.categoryColorsActive[categoryName])
    .attr('opacity', opacity);
};

export const addCategoryLineLabel = ({ svg, categoryName, position, opacity = 1 }) => {
  svg.select('.g-line-labels').append('text').attr('class', kebabCase(categoryName));

  changeCategoryLineLabel({ svg, categoryName, position, opacity });
};

export const removeCategoryLineLabel = ({ svg, categoryName, delay = 0 }) => {
  svg
    .select(`.g-line-labels .${kebabCase(categoryName)}`)
    .transition()
    .duration(0)
    .delay(delay)
    .remove();
};

export const isAddedCategoryLineLabel = ({ svg, categoryName }) => {
  return !svg.select(`.g-line-labels .${kebabCase(categoryName)}`).empty();
};

export const changeActiveNonTotalCategoryLines = ({ svg, dataMzStd, line, x, y, activeCategoryNames, delay = 0 }) => {
  const dataMzStdWithoutTotal = dataMzStd.filter((category) => category.skupina !== 'Celkem');

  dataMzStdWithoutTotal.forEach((category) => {
    let style = 'context';
    let activeColor;
    if (activeCategoryNames.includes(category.skupina)) {
      style = 'active';
      activeColor = colors.categoryColorsActive[category.skupina];
    }

    changeCategoryLine({
      svg,
      categoryName: category.skupina,
      d: line(category.data),
      style,
      activeColor,
      duration: 700,
      delay,
    });

    const labelExists = isAddedCategoryLineLabel({
      svg,
      categoryName: category.skupina,
    });

    if (activeCategoryNames.includes(category.skupina) && !labelExists) {
      addCategoryLineLabel({
        svg,
        categoryName: category.skupina,
        position: {
          x: x(categoryLineLabelPositions[category.skupina].x),
          y: y(categoryLineLabelPositions[category.skupina].y),
          textAnchor: categoryLineLabelPositions[category.skupina].textAnchor,
        },
        opacity: 0,
        delay,
      });

      changeCategoryLineLabel({
        svg,
        categoryName: category.skupina,
        position: {
          x: x(categoryLineLabelPositions[category.skupina].x),
          y: y(categoryLineLabelPositions[category.skupina].y),
          textAnchor: categoryLineLabelPositions[category.skupina].textAnchor,
        },
        opacity: 1,
        duration: 700,
        delay,
      });
    } else if (!activeCategoryNames.includes(category.skupina) && labelExists) {
      changeCategoryLineLabel({
        svg,
        categoryName: category.skupina,
        position: {
          x: x(categoryLineLabelPositions[category.skupina].x),
          y: y(categoryLineLabelPositions[category.skupina].y),
          textAnchor: categoryLineLabelPositions[category.skupina].textAnchor,
        },
        opacity: 0,
        duration: 700,
        delay,
      });

      removeCategoryLineLabel({
        svg,
        categoryName: category.skupina,
        delay: delay + 700,
      });
    }
  });

  activeCategoryNames.forEach((categoryName) => {
    bringCategoryLineToFront({ svg, categoryName });
  });
};

export const categoryLineLabelTexts = {
  Celkem: 'Úmrtí celkem',
};

export const categoryLineLabelPositions = {
  Celkem: { x: d3.timeParse('%Y')(1996), y: 1640, textAnchor: 'start' },

  'Nemoci oběhové soustavy': {
    x: d3.timeParse('%Y')(2000),
    y: 870,
    textAnchor: 'start',
  },

  Novotvary: {
    x: d3.timeParse('%Y')(2000),
    y: 410,
    textAnchor: 'start',
  },

  'Některé infekční a parazitární nemoci': {
    x: d3.timeParse('%Y')(2000),
    y: 8,
    textAnchor: 'start',
  },

  'Úmyslné sebepoškození': {
    x: d3.timeParse('%Y')(2000),
    y: 21,
    textAnchor: 'start',
  },

  'Dopravní nehody': {
    x: d3.timeParse('%Y')(2000),
    y: 18,
    textAnchor: 'start',
  },

  'Napadení (útok)': {
    x: d3.timeParse('%Y')(2000),
    y: 5,
    textAnchor: 'start',
  },
};
