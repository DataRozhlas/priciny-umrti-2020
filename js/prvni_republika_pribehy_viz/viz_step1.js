import * as d3 from 'd3';

import * as xAxisAnnotations from './x_axis_annotations';

export default {
  onScrollDownToStep: (viz) => {
    xAxisAnnotations.fadeInFirstRepublicLabel(viz, { xPos: viz.x(d3.timeParse('%Y')(1929)), margin: viz.margin });

    xAxisAnnotations.fadeInSecondWWBand(viz, {
      xPos: viz.x(d3.timeParse('%Y')(1939)),
      bandWidth: viz.x(d3.timeParse('%Y')(1945)) - viz.x(d3.timeParse('%Y')(1939)),
      margin: viz.margin,
    });

    xAxisAnnotations.fadeInSecondWWLabel(viz, { xPos: viz.x(d3.timeParse('%Y')(1942)), margin: viz.margin });

    xAxisAnnotations.fadeInCommunistCoupLine(viz, { xPos: viz.x(d3.timeParse('%Y')(1948)), margin: viz.margin });

    xAxisAnnotations.fadeInCommunistCoupLabel(viz, { xPos: viz.x(d3.timeParse('%Y')(1948)), margin: viz.margin });
  },
  onScrollUpFromStep: (viz) => {
    xAxisAnnotations.fadeOutFirstRepublicLabel(viz);
    xAxisAnnotations.fadeOutSecondWWBand(viz);
    xAxisAnnotations.fadeOutSecondWWLabel(viz);
    xAxisAnnotations.fadeOutCommunistCoupLine(viz);
    xAxisAnnotations.fadeOutCommunistCoupLabel(viz);
  },
};
