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

// First republic label

export const updateFirstRepublicLabel = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 } = {}) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let firstRepublicLabel = xAxisAnnotationsG.select('.first-republic-label');

  if (firstRepublicLabel.empty()) {
    firstRepublicLabel = xAxisAnnotationsG.append('text').attr('class', 'first-republic-label');
  }

  firstRepublicLabel
    .transition()
    .delay(delay)
    .duration(duration)
    .text('První republika')
    .attr('x', xPos !== undefined ? xPos : firstRepublicLabel.attr('x'))
    .attr(
      'y',
      margin !== undefined ? viz.height - margin.bottom + (viz.width < 768 ? 32 : 40) : firstRepublicLabel.attr('y')
    )
    .attr('text-anchor', 'middle')
    .attr('opacity', opacity);
};

export const removeFirstRepublicLabel = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.first-republic-label').transition().duration(0).delay(delay).remove();
};

export const fadeInFirstRepublicLabel = (viz, { xPos, margin } = {}) => {
  updateFirstRepublicLabel(viz, { xPos, margin, opacity: 0 });
  updateFirstRepublicLabel(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutFirstRepublicLabel = (viz) => {
  updateFirstRepublicLabel(viz, { opacity: 0, duration: 700 });
  removeFirstRepublicLabel(viz, { delay: 700 });
};

// Second WW band

export const updateSecondWWBand = (viz, { xPos, bandWidth, margin, opacity = 1, duration = 0, delay = 0 }) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let secondWWBand = xAxisAnnotationsG.select('.second-ww-band');

  if (secondWWBand.empty()) {
    secondWWBand = xAxisAnnotationsG.append('rect').attr('class', 'second-ww-band');
  }

  secondWWBand
    .transition()
    .delay(delay)
    .duration(duration)
    .attr('width', bandWidth !== undefined ? bandWidth : secondWWBand.attr('width'))
    .attr(
      'height',
      margin !== undefined
        ? viz.height - margin.top - margin.bottom + (viz.width < 768 ? 37 : 50)
        : secondWWBand.attr('height')
    )
    .attr('x', xPos !== undefined ? xPos : secondWWBand.attr('x'))
    .attr('y', margin !== undefined ? margin.top : secondWWBand.attr('y'))
    .attr('opacity', opacity);
};

export const removeSecondWWBand = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.second-ww-band').transition().duration(0).delay(delay).remove();
};

export const fadeInSecondWWBand = (viz, { xPos, bandWidth, margin }) => {
  updateSecondWWBand(viz, { xPos, bandWidth, margin, opacity: 0 });
  updateSecondWWBand(viz, { xPos, bandWidth, margin, opacity: 1, duration: 700 });
};

export const fadeOutSecondWWBand = (viz) => {
  updateSecondWWBand(viz, { opacity: 0, duration: 700 });
  removeSecondWWBand(viz, { delay: 700 });
};

// Second WW label

export const updateSecondWWLabel = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 } = {}) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let secondWWLabel = xAxisAnnotationsG.select('.second-ww-label');

  if (secondWWLabel.empty()) {
    secondWWLabel = xAxisAnnotationsG.append('text').attr('class', 'second-ww-label');
  }

  secondWWLabel
    .transition()
    .delay(delay)
    .duration(duration)
    .text('2. světová válka')
    .attr('x', xPos !== undefined ? xPos : secondWWLabel.attr('x'))
    .attr(
      'y',
      margin !== undefined ? viz.height - margin.bottom + (viz.width < 768 ? 32 : 40) : secondWWLabel.attr('y')
    )
    .attr('text-anchor', 'middle')
    .attr('opacity', opacity);
};

export const removeSecondWWLabel = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.second-ww-label').transition().duration(0).delay(delay).remove();
};

export const fadeInSecondWWLabel = (viz, { xPos, margin } = {}) => {
  updateSecondWWLabel(viz, { xPos, margin, opacity: 0 });
  updateSecondWWLabel(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutSecondWWLabel = (viz) => {
  updateSecondWWLabel(viz, { opacity: 0, duration: 700 });
  removeSecondWWLabel(viz, { delay: 700 });
};

// Communist coup line

export const updateCommunistCoupLine = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 }) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let communistCoupLine = xAxisAnnotationsG.select('.communist-coup-line');

  if (communistCoupLine.empty()) {
    communistCoupLine = xAxisAnnotationsG.append('line').attr('class', 'communist-coup-line');
  }

  communistCoupLine
    .transition()
    .delay(delay)
    .duration(duration)
    .attr('x1', xPos !== undefined ? xPos : communistCoupLine.attr('x1'))
    .attr('y1', margin !== undefined ? margin.top : communistCoupLine.attr('y1'))
    .attr('x2', xPos !== undefined ? xPos : communistCoupLine.attr('x2'))
    .attr('y2', margin !== undefined ? viz.height - margin.bottom + 50 : communistCoupLine.attr('y2'))
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('fill', 'none')
    .attr('opacity', opacity);
};

export const removeCommunistCoupLine = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.communist-coup-line').transition().duration(0).delay(delay).remove();
};

export const fadeInCommunistCoupLine = (viz, { xPos, margin }) => {
  updateCommunistCoupLine(viz, { xPos, margin, opacity: 0 });
  updateCommunistCoupLine(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutCommunistCoupLine = (viz) => {
  updateCommunistCoupLine(viz, { opacity: 0, duration: 700 });
  removeCommunistCoupLine(viz, { delay: 700 });
};

// Communist coup label

export const updateCommunistCoupLabel = (viz, { xPos, margin, opacity = 1, duration = 0, delay = 0 } = {}) => {
  const xAxisAnnotationsG = getXAxisAnnotationsGroup(viz);

  let communistCoupLabel = xAxisAnnotationsG.select('.communist-coup-label');

  if (communistCoupLabel.empty()) {
    communistCoupLabel = xAxisAnnotationsG.append('text').attr('class', 'communist-coup-label');
  }

  if (viz.width < 768) {
    communistCoupLabel
      .transition()
      .delay(delay)
      .duration(duration)
      .text('Komunistický převrat')
      .attr('x', xPos !== undefined ? xPos - 3 : communistCoupLabel.attr('x'))
      .attr('y', margin !== undefined ? viz.height - margin.bottom + 50 : communistCoupLabel.attr('y'))
      .attr('text-anchor', 'end')
      .attr('opacity', opacity);
  } else {
    communistCoupLabel
      .transition()
      .delay(delay)
      .duration(duration)
      .attr('y', margin !== undefined ? viz.height - margin.bottom + 35 : communistCoupLabel.attr('y'))
      .attr('text-anchor', 'end')
      .attr('opacity', opacity);

    let line1 = communistCoupLabel.select('.line-1');
    if (line1.empty()) {
      line1 = communistCoupLabel.append('tspan').attr('class', 'line-1');
    }
    let line2 = communistCoupLabel.select('.line-2');
    if (line2.empty()) {
      line2 = communistCoupLabel.append('tspan').attr('class', 'line-2');
    }

    line1
      .transition()
      .delay(delay)
      .duration(duration)
      .text('Komunistický')
      .attr('x', xPos !== undefined ? xPos - 5 : line1.attr('x'));
    line2
      .transition()
      .delay(delay)
      .duration(duration)
      .text('převrat')
      .attr('dy', 15)
      .attr('x', xPos !== undefined ? xPos - 5 : line2.attr('x'));
  }
};

export const removeCommunistCoupLabel = (viz, { delay = 0 }) => {
  getXAxisAnnotationsGroup(viz).select('.communist-coup-label').transition().duration(0).delay(delay).remove();
};

export const fadeInCommunistCoupLabel = (viz, { xPos, margin } = {}) => {
  updateCommunistCoupLabel(viz, { xPos, margin, opacity: 0 });
  updateCommunistCoupLabel(viz, { xPos, margin, opacity: 1, duration: 700 });
};

export const fadeOutCommunistCoupLabel = (viz) => {
  updateCommunistCoupLabel(viz, { opacity: 0, duration: 700 });
  removeCommunistCoupLabel(viz, { delay: 700 });
};
