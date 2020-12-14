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

// Prague spring line

export const updatePragueSpringLine = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 }) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let pragueSpringLine = xAxisAnnotationsG.select('.prague-spring-line');

  if (pragueSpringLine.empty()) {
    pragueSpringLine = xAxisAnnotationsG.append('line').attr('class', 'prague-spring-line annotation-line');
  }

  pragueSpringLine
    .transition()
    .delay(delay)
    .duration(duration)
    .attr('x1', xPos !== undefined ? xPos : pragueSpringLine.attr('x1'))
    .attr('y1', margin !== undefined ? margin.top : pragueSpringLine.attr('y1'))
    .attr('x2', xPos !== undefined ? xPos : pragueSpringLine.attr('x2'))
    .attr('y2', margin !== undefined ? viz.height - margin.bottom + 45 : pragueSpringLine.attr('y2'))
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('fill', 'none')
    .attr('opacity', opacity);
};

export const removePragueSpringLine = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.prague-spring-line').transition().duration(0).delay(delay).remove();
};

export const fadeInPragueSpringLine = (viz, { xPos, margin }) => {
  updatePragueSpringLine(viz, { xPos, margin, opacity: 0 });
  updatePragueSpringLine(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutPragueSpringLine = (viz) => {
  updatePragueSpringLine(viz, { opacity: 0, duration: 700 });
  removePragueSpringLine(viz, { delay: 700 });
};

// Prague spring label

export const updatePragueSpringLabel = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 } = {}) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let pragueSpringLabel = xAxisAnnotationsG.select('.prague-spring-label');

  if (pragueSpringLabel.empty()) {
    pragueSpringLabel = xAxisAnnotationsG.append('text').attr('class', 'prague-spring-label');
  }

  pragueSpringLabel
    .transition()
    .delay(delay)
    .duration(duration)
    .text('Pražské jaro')
    .attr('x', xPos !== undefined ? xPos - 8 : pragueSpringLabel.attr('x'))
    .attr('y', margin !== undefined ? viz.height - margin.bottom + 40 : pragueSpringLabel.attr('y'))
    .attr('text-anchor', 'end')
    .attr('opacity', opacity);
};

export const removePragueSpringLabel = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.prague-spring-label').transition().duration(0).delay(delay).remove();
};

export const fadeInPragueSpringLabel = (viz, { xPos, margin } = {}) => {
  updatePragueSpringLabel(viz, { xPos, margin, opacity: 0 });
  updatePragueSpringLabel(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutPragueSpringLabel = (viz) => {
  updatePragueSpringLabel(viz, { opacity: 0, duration: 700 });
  removePragueSpringLabel(viz, { delay: 700 });
};

// Velvet revolution line

export const updateVelvetRevolutionLine = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 }) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let velvetRevolutionLine = xAxisAnnotationsG.select('.velvet-revolution-line');

  if (velvetRevolutionLine.empty()) {
    velvetRevolutionLine = xAxisAnnotationsG.append('line').attr('class', 'velvet-revolution-line annotation-line');
  }

  velvetRevolutionLine
    .transition()
    .delay(delay)
    .duration(duration)
    .attr('x1', xPos !== undefined ? xPos : velvetRevolutionLine.attr('x1'))
    .attr('y1', margin !== undefined ? margin.top : velvetRevolutionLine.attr('y1'))
    .attr('x2', xPos !== undefined ? xPos : velvetRevolutionLine.attr('x2'))
    .attr('y2', margin !== undefined ? viz.height - margin.bottom + 45 : velvetRevolutionLine.attr('y2'))
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('fill', 'none')
    .attr('opacity', opacity);
};

export const removeVelvetRevolutionLine = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.velvet-revolution-line').transition().duration(0).delay(delay).remove();
};

export const fadeInVelvetRevolutionLine = (viz, { xPos, margin }) => {
  updateVelvetRevolutionLine(viz, { xPos, margin, opacity: 0 });
  updateVelvetRevolutionLine(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutVelvetRevolutionLine = (viz) => {
  updateVelvetRevolutionLine(viz, { opacity: 0, duration: 700 });
  removeVelvetRevolutionLine(viz, { delay: 700 });
};

// Velvet revolution label

export const updateVelvetRevolutionLabel = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 } = {}) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let velvetRevolutionLabel = xAxisAnnotationsG.select('.velvet-revolution-label');

  if (velvetRevolutionLabel.empty()) {
    velvetRevolutionLabel = xAxisAnnotationsG.append('text').attr('class', 'velvet-revolution-label');
  }

  velvetRevolutionLabel
    .transition()
    .delay(delay)
    .duration(duration)
    .text('Sametová revoluce')
    .attr('x', xPos !== undefined ? xPos - 8 : velvetRevolutionLabel.attr('x'))
    .attr('y', margin !== undefined ? viz.height - margin.bottom + 40 : velvetRevolutionLabel.attr('y'))
    .attr('text-anchor', 'end')
    .attr('opacity', opacity);
};

export const removeVelvetRevolutionLabel = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.velvet-revolution-label').transition().duration(0).delay(delay).remove();
};

export const fadeInVelvetRevolutionLabel = (viz, { xPos, margin } = {}) => {
  updateVelvetRevolutionLabel(viz, { xPos, margin, opacity: 0 });
  updateVelvetRevolutionLabel(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutVelvetRevolutionLabel = (viz) => {
  updateVelvetRevolutionLabel(viz, { opacity: 0, duration: 700 });
  removeVelvetRevolutionLabel(viz, { delay: 700 });
};
