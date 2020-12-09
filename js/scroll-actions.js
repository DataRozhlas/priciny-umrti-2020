import * as d3 from 'd3';
import { getSvgElementId, getKebabCase } from './utilities';
import { getCategoryColor, animationDuration } from './visualization_config';

export const setHighlightLine = ({ svg, category }) => {
  svg
    .select('#' + getSvgElementId('line', category))
    .transition()
    .duration(animationDuration)
    .attr('stroke', getCategoryColor(category))
    .attr('stroke-width', 2);

  svg.select('#' + getSvgElementId('text', category)).attr('visibility', 'visible');
};

export const setContextLine = ({ svg, category }) => {
  svg
    .select('#' + getSvgElementId('line', category))
    .transition()
    .duration(animationDuration)
    .attr('stroke', getCategoryColor('context'))
    .attr('stroke-width', 1);

  svg.select('#' + getSvgElementId('text', category)).attr('visibility', 'hidden');
};

export const setVisitedLine = ({ svg, category }) => {
  svg
    .select('#' + getSvgElementId('line', category))
    .transition()
    .duration(animationDuration)
    .attr('stroke', getCategoryColor('visited'))
    .attr('stroke-width', 1);

  svg.select('#' + getSvgElementId('text', category)).attr('visibility', 'hidden');
};

export const setDarkToAllLines = ({ svg, svgClass }) => {
  svg
    .selectAll('path.' + svgClass)
    .transition()
    .duration(animationDuration)
    .ease(d3.easeLinear)
    .attr('stroke', getCategoryColor('default'))
    .attr('stroke-width', 1);

  svg.selectAll('text.series-label').attr('visibility', 'hidden');
};

export const setContextToAllLines = ({ svg, svgClass }) => {
  svg
    .selectAll('path.' + svgClass)
    .transition()
    .duration(animationDuration)
    .ease(d3.easeLinear)
    .attr('stroke', getCategoryColor('context'))
    .attr('stroke-width', 1);

  svg.selectAll('text.series-label').attr('visibility', 'hidden');
};

export const setHighlightToAllLines = ({ svg, svgClass }) => {
  console.log('jou, i am here');
  svg
    .selectAll('path.' + svgClass)
    .transition()
    .duration(animationDuration)
    .ease(d3.easeLinear)
    .attr('stroke', (d) => {
      console.log(d);
      console.log(getKebabCase(d.category));
      return getCategoryColor(getKebabCase(d.category));
    })
    .attr('stroke-width', 2);

  svg.selectAll('text.series-label').attr('visibility', 'visible');
};
