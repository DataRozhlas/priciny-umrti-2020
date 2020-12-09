import * as d3 from 'd3';

const vizStep1 = {
  onScrollDownToStep: ({ svg, x, yTotal, width }) => {
    const svgXAxisAnnotationsG = svg
      .append('g')
      .attr('class', 'g-xaxis-annotations')
      // Makes the <g> element first under <svg>, therefore behind
      // all the other parts
      .lower();

    // First republic label

    svgXAxisAnnotationsG
      .append('text')
      .attr('class', 'first-republic-label')
      .text('První republika')
      .attr('x', x(d3.timeParse('%Y')(1929)))
      .attr('y', yTotal(0) + (width < 768 ? 32 : 40))
      .attr('text-anchor', 'middle')
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    // 2WW band

    svgXAxisAnnotationsG
      .append('rect')
      .attr('class', 'secondww-rect')
      .attr('width', x(d3.timeParse('%Y')(1945)) - x(d3.timeParse('%Y')(1939)))
      .attr('height', yTotal(0) - yTotal(2400) + (width < 768 ? 37 : 50))
      .attr('x', x(d3.timeParse('%Y')(1939)))
      .attr('y', yTotal(2400))
      .style('fill', '#f5f5f5')
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    // 2WW label

    svgXAxisAnnotationsG
      .append('text')
      .attr('class', 'secondww-label')
      .text('2. světová válka')
      .attr('x', x(d3.timeParse('%Y')(1942)))
      .attr('y', yTotal(0) + (width < 768 ? 32 : 40))
      .attr('text-anchor', 'middle')
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    // Communist coup line

    svgXAxisAnnotationsG
      .append('line')
      .attr('class', 'communist-coup-line')
      .attr('x1', x(d3.timeParse('%Y')(1948)))
      .attr('y1', yTotal(0) + 50)
      .attr('x2', x(d3.timeParse('%Y')(1948)))
      .attr('y2', yTotal(2400))
      .attr('stroke', '#cccccc')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('fill', 'none')
      .attr('opacity', 0)
      .transition()
      .duration(700)
      .attr('opacity', 1);

    // Communist coup label

    if (width < 768) {
      svgXAxisAnnotationsG
        .append('text')
        .attr('class', 'communist-coup-label')
        .text('Komunistický převrat')
        .attr('x', x(d3.timeParse('%Y')(1948)) - 3)
        .attr('y', yTotal(0) + 50)
        .attr('text-anchor', 'end')
        .attr('opacity', 0)
        .transition()
        .duration(700)
        .attr('opacity', 1);
    } else {
      const communistCoupLabel = svgXAxisAnnotationsG
        .append('text')
        .attr('class', 'communist-coup-label')
        .attr('y', yTotal(0) + 35)

        .attr('text-anchor', 'end');

      communistCoupLabel.attr('opacity', 0).transition().duration(700).attr('opacity', 1);

      communistCoupLabel
        .append('tspan')
        .text('Komunistický')
        .attr('x', x(d3.timeParse('%Y')(1948)) - 5);
      communistCoupLabel
        .append('tspan')
        .text('převrat')
        .attr('dy', 15)
        .attr('x', x(d3.timeParse('%Y')(1948)) - 5);
    }
  },
  onScrollUpFromStep: ({ svg }) => {
    // Remove annotations

    svg.select('.g-xaxis-annotations').remove();
  },
};

export default vizStep1;
