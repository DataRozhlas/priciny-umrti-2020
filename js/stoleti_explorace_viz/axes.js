import * as d3 from 'd3';

export const updateXAxis = (viz, { x, margin, delay = 0, duration = 700 }) => {
  let xAxisG = viz.svg.select('.g-x-axis');
  if (xAxisG.empty()) {
    xAxisG = viz.svg.append('g').attr('class', 'g-x-axis');
  }

  const axisWidth = viz.width - margin.left - margin.right;

  let ticksEvery = 5;
  if (axisWidth < 700 && axisWidth >= 400) {
    ticksEvery = 10;
  } else if (axisWidth < 400) {
    ticksEvery = 20;
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

  let xPos = 10;
  let yPos = 92;
  let dy = 15;

  if (window.innerWidth < 768) {
    xPos = 0;
    yPos = 102;
    dy = 12;
  }

  const xAxisLabel = xAxisLabelG
    .append('text')
    .attr('class', 'x-axis-label')
    .attr('y', yPos)
    .attr('text-anchor', 'start');

  xAxisLabel.append('tspan').text('Úmrtí na 100 tisíc').attr('x', xPos);
  xAxisLabel.append('tspan').text('(std. k 2018)').attr('dy', dy).attr('x', xPos);
};
