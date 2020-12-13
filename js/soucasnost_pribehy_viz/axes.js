import * as d3 from 'd3';

export const updateXAxis = (viz, { x, margin, delay = 0, duration = 700 }) => {
  let xAxisG = viz.svg.select('.g-x-axis');
  if (xAxisG.empty()) {
    xAxisG = viz.svg.append('g').attr('class', 'g-x-axis');
  }

  const axisWidth = viz.width - margin.left - margin.right;

  let ticksEvery = 1;
  if (axisWidth < 700 && axisWidth >= 400) {
    ticksEvery = 2;
  } else if (axisWidth < 400) {
    ticksEvery = 5;
  }

  xAxisG
    .transition()
    .delay(delay)
    .duration(duration)
    .call((g) =>
      g
        .attr('transform', `translate(0,${viz.height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(d3.timeYear.every(ticksEvery)).tickSizeOuter(0).tickFormat(d3.timeFormat('%Y')))
    );
};

export const updateYAxis = (viz, { y, margin, delay = 0, duration = 700 }) => {
  let yAxisG = viz.svg.select('.g-y-axis');
  if (yAxisG.empty()) {
    yAxisG = viz.svg.append('g').attr('class', 'g-y-axis');
  }

  yAxisG
    .transition()
    .delay(delay)
    .duration(duration)
    .call((g) =>
      g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        // Remove the axis line to make the chart lighter
        .call((g) => g.select('.domain').attr('stroke-width', 0))
    );
};

export const createYAxisLabel = (viz) => {
  const xAxisLabelG = viz.svg.append('g').attr('class', 'g-x-axis-label');

  let xPos = viz.margin.left - 6;
  let yPos = viz.margin.top - 45;
  let dy = 14;

  if (window.innerWidth < 768) {
    xPos = 48;
    yPos = viz.margin.top - 38;
    dy = 12;
  }

  const xAxisLabel = xAxisLabelG
    .append('text')
    .attr('class', 'x-axis-label')
    .attr('y', yPos)
    .attr('text-anchor', 'end');

  xAxisLabel.append('tspan').text('Úmrtí na').attr('x', xPos);
  xAxisLabel.append('tspan').text('100 tisíc').attr('dy', dy).attr('x', xPos);
  xAxisLabel.append('tspan').text('(std. 2018)').attr('dy', dy).attr('x', xPos);
};
