import * as d3 from 'd3';
import kebabCase from 'lodash/kebabCase';

import * as colors from './colors';
import * as texts from './texts';
import * as tooltip from './tooltip';

export const createLinesGroup = (viz) => {
  viz.svg.append('g').attr('class', 'g-lines');
};

export const createLineLabelsGroup = (viz) => {
  viz.svg.append('g').attr('class', 'g-line-labels');
};

export const changeCategoryLine = ({
  svg,
  categoryName,
  d,
  style,
  activeColor,
  duration = 0,
  delay = 0,
  opacity = 1,
}) => {
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
    .attr('fill', 'none')
    .attr('opacity', opacity);
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

export const changeActiveNonTotalCategoryLines = (viz, { line, x, y, activeCategoryNames }) => {
  const dataMzStdWithoutTotal = viz.dataMzStd.filter((category) => category.skupina !== 'Celkem');

  dataMzStdWithoutTotal.forEach((category) => {
    let style = 'context';
    let activeColor;
    if (activeCategoryNames.includes(category.skupina)) {
      style = 'active';
      activeColor = colors.categoryColorsActive[category.skupina];
    }

    changeCategoryLine({
      svg: viz.svg,
      categoryName: category.skupina,
      d: line(category.data),
      style,
      activeColor,
      duration: 700,
    });

    const labelExists = isAddedCategoryLineLabel({
      svg: viz.svg,
      categoryName: category.skupina,
    });

    if (activeCategoryNames.includes(category.skupina) && !labelExists) {
      addCategoryLineLabel({
        svg: viz.svg,
        categoryName: category.skupina,
        position: {
          x: x(categoryLineLabelPositions[category.skupina].x),
          y: y(categoryLineLabelPositions[category.skupina].y),
          textAnchor: categoryLineLabelPositions[category.skupina].textAnchor,
        },
        opacity: 0,
      });

      changeCategoryLineLabel({
        svg: viz.svg,
        categoryName: category.skupina,
        position: {
          x: x(categoryLineLabelPositions[category.skupina].x),
          y: y(categoryLineLabelPositions[category.skupina].y),
          textAnchor: categoryLineLabelPositions[category.skupina].textAnchor,
        },
        opacity: 1,
        duration: 700,
      });
    } else if (!activeCategoryNames.includes(category.skupina) && labelExists) {
      changeCategoryLineLabel({
        svg: viz.svg,
        categoryName: category.skupina,
        position: {
          x: x(categoryLineLabelPositions[category.skupina].x),
          y: y(categoryLineLabelPositions[category.skupina].y),
          textAnchor: categoryLineLabelPositions[category.skupina].textAnchor,
        },
        opacity: 0,
        duration: 700,
      });

      removeCategoryLineLabel({
        svg: viz.svg,
        categoryName: category.skupina,
        delay: 700,
      });
    }

    if (activeCategoryNames.includes(category.skupina)) {
      if (!tooltip.areAddedCategoryLineTooltipTriggers(viz, { categoryName: category.skupina })) {
        tooltip.updateCategoryLineTooltipTriggers(viz, {
          categoryName: category.skupina,
          x,
          y,
          activeColor: 'transparent',
        });
      }

      tooltip.updateCategoryLineTooltipTriggers(viz, {
        categoryName: category.skupina,
        x,
        y,
        activeColor,
        duration: 700,
      });
    } else {
      tooltip.updateCategoryLineTooltipTriggers(viz, {
        categoryName: category.skupina,
        x,
        y,
        activeColor: 'transparent',
      });

      tooltip.removeCategoryLineTooltipTriggers(viz, {
        categoryName: category.skupina,
        delay: 700,
      });
    }
  });

  tooltip.hideTooltip();

  activeCategoryNames.forEach((categoryName) => {
    bringCategoryLineToFront({ svg: viz.svg, categoryName });
  });
};

export const categoryLineLabelTexts = {
  Celkem: 'Úmrtí celkem',
};

export const categoryLineLabelPositions = {
  Celkem: { x: d3.timeParse('%Y')(1955), y: 2300, textAnchor: 'start' },
};
