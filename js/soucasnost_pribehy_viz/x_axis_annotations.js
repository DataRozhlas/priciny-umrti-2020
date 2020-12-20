import * as d3 from 'd3';

export const createXAxisAnnotationsGroup = (viz) => {
  viz.svg
    .append('g')
    .attr('class', 'g-x-axis-annotations')
    // Makes the <g> element first under <svg>, therefore behind
    // all the other parts
    .lower();
};

export const getXAxisAnnotationsGroup = ({ svg }) => svg.select('.g-x-axis-annotations');

// Czechoslovakia split line

export const updateCzechoslovakiaSplitLine = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 }) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let czechoslovakiaSplitLine = xAxisAnnotationsG.select('.czechoslovakia-split-line');

  if (czechoslovakiaSplitLine.empty()) {
    czechoslovakiaSplitLine = xAxisAnnotationsG
      .append('line')
      .attr('class', 'czechoslovakia-split-line annotation-line');
  }

  czechoslovakiaSplitLine
    .transition()
    .delay(delay)
    .duration(duration)
    .attr('x1', xPos !== undefined ? xPos : czechoslovakiaSplitLine.attr('x1'))
    .attr('y1', margin !== undefined ? margin.top : czechoslovakiaSplitLine.attr('y1'))
    .attr('x2', xPos !== undefined ? xPos : czechoslovakiaSplitLine.attr('x2'))
    .attr('y2', margin !== undefined ? viz.height - margin.bottom + 45 : czechoslovakiaSplitLine.attr('y2'))
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('fill', 'none')
    .attr('opacity', opacity);
};

export const removeCzechoslovakiaSplitLine = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.czechoslovakia-split-line').transition().duration(0).delay(delay).remove();
};

export const fadeInCzechoslovakiaSplitLine = (viz, { xPos, margin }) => {
  updateCzechoslovakiaSplitLine(viz, { xPos, margin, opacity: 0 });
  updateCzechoslovakiaSplitLine(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutCzechoslovakiaSplitLine = (viz) => {
  updateCzechoslovakiaSplitLine(viz, { opacity: 0, duration: 700 });
  removeCzechoslovakiaSplitLine(viz, { delay: 700 });
};

// Czechoslovakia split label

export const updateCzechoslovakiaSplitLabel = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 } = {}) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let czechoslovakiaSplitLabel = xAxisAnnotationsG.select('.czechoslovakia-split-label');

  if (czechoslovakiaSplitLabel.empty()) {
    czechoslovakiaSplitLabel = xAxisAnnotationsG.append('text').attr('class', 'czechoslovakia-split-label');
  }

  czechoslovakiaSplitLabel
    .transition()
    .delay(delay)
    .duration(duration)
    .text('Rozdělení Československa')
    .attr('x', xPos !== undefined ? xPos + 8 : czechoslovakiaSplitLabel.attr('x'))
    .attr('y', margin !== undefined ? viz.height - margin.bottom + 40 : czechoslovakiaSplitLabel.attr('y'))
    .attr('text-anchor', 'start')
    .attr('opacity', opacity);
};

export const removeCzechoslovakiaSplitLabel = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.czechoslovakia-split-label').transition().duration(0).delay(delay).remove();
};

export const fadeInCzechoslovakiaSplitLabel = (viz, { xPos, margin } = {}) => {
  updateCzechoslovakiaSplitLabel(viz, { xPos, margin, opacity: 0 });
  updateCzechoslovakiaSplitLabel(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutCzechoslovakiaSplitLabel = (viz) => {
  updateCzechoslovakiaSplitLabel(viz, { opacity: 0, duration: 700 });
  removeCzechoslovakiaSplitLabel(viz, { delay: 700 });
};

// EU joined line

export const updateEuJoinedLine = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 }) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let euJoinedLine = xAxisAnnotationsG.select('.eu-joined-line');

  if (euJoinedLine.empty()) {
    euJoinedLine = xAxisAnnotationsG.append('line').attr('class', 'eu-joined-line annotation-line');
  }

  euJoinedLine
    .transition()
    .delay(delay)
    .duration(duration)
    .attr('x1', xPos !== undefined ? xPos : euJoinedLine.attr('x1'))
    .attr('y1', margin !== undefined ? margin.top : euJoinedLine.attr('y1'))
    .attr('x2', xPos !== undefined ? xPos : euJoinedLine.attr('x2'))
    .attr('y2', margin !== undefined ? viz.height - margin.bottom + 45 : euJoinedLine.attr('y2'))
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('fill', 'none')
    .attr('opacity', opacity);
};

export const removeEuJoinedLine = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.eu-joined-line').transition().duration(0).delay(delay).remove();
};

export const fadeInEuJoinedLine = (viz, { xPos, margin }) => {
  updateEuJoinedLine(viz, { xPos, margin, opacity: 0 });
  updateEuJoinedLine(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutEuJoinedLine = (viz) => {
  updateEuJoinedLine(viz, { opacity: 0, duration: 700 });
  removeEuJoinedLine(viz, { delay: 700 });
};

// EU joined label

export const updateEuJoinedLabel = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 } = {}) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let euJoinedLabel = xAxisAnnotationsG.select('.eu-joined-label');

  if (euJoinedLabel.empty()) {
    euJoinedLabel = xAxisAnnotationsG.append('text').attr('class', 'eu-joined-label');
  }

  euJoinedLabel
    .transition()
    .delay(delay)
    .duration(duration)
    .text('Vstup ČR do Evropské unie')
    .attr('x', xPos !== undefined ? xPos + 8 : euJoinedLabel.attr('x'))
    .attr('y', margin !== undefined ? viz.height - margin.bottom + 40 : euJoinedLabel.attr('y'))
    .attr('text-anchor', 'start')
    .attr('opacity', opacity);
};

export const removeEuJoinedLabel = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.eu-joined-label').transition().duration(0).delay(delay).remove();
};

export const fadeInEuJoinedLabel = (viz, { xPos, margin } = {}) => {
  updateEuJoinedLabel(viz, { xPos, margin, opacity: 0 });
  updateEuJoinedLabel(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutEuJoinedLabel = (viz) => {
  updateEuJoinedLabel(viz, { opacity: 0, duration: 700 });
  removeEuJoinedLabel(viz, { delay: 700 });
};
