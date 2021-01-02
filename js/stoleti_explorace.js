import debounce from 'lodash/debounce';

import { default as datarozhlasScrolly, initDots } from './datarozhlas_scrolly_fullscreen';
import { initViz } from './stoleti_explorace_viz';

const stoletiExplorace = async () => {
  const data = await fetchData();

  const dots = initDots('.stoleti-explorace-scrolly');

  let viz = initViz('.stoleti-explorace-scrolly .stoleti-explorace-viz', data);
  let scrolly = datarozhlasScrolly('.stoleti-explorace-scrolly', {
    onScrollDownToStep: (index) => {
      viz.onScrollDownToStep(index);
      dots.onScrollDownToStep(index);
    },
    onScrollUpFromStep: (index) => {
      viz.onScrollUpFromStep(index);
      dots.onScrollUpFromStep(index);
    },
  });

  let windowInnerWidthBefore = window.innerWidth;
  let windowInnerHeightBefore = window.innerHeight;

  const reinitVizAfterResize = debounce((e) => {
    if (windowInnerWidthBefore !== window.innerWidth || windowInnerHeightBefore < window.innerHeight) {
      viz.destroy();
      scrolly.destroy();

      viz = initViz('.stoleti-explorace-scrolly .stoleti-explorace-viz', data);
      scrolly = datarozhlasScrolly('.stoleti-explorace-scrolly', {
        onScrollDownToStep: (index) => {
          viz.onScrollDownToStep(index);
          dots.onScrollDownToStep(index);
        },
        onScrollUpFromStep: (index) => {
          viz.onScrollUpFromStep(index);
          dots.onScrollUpFromStep(index);
        },
      });

      windowInnerWidthBefore = window.innerWidth;
      windowInnerHeightBefore = window.innerHeight;
    }
  }, 200);

  window.addEventListener('resize', reinitVizAfterResize);
};

const fetchData = () => {
  return Promise.all([
    fetch(`${window.dataRozhlasBaseUrl}data/long_mz_std.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch(`${window.dataRozhlasBaseUrl}data/long_mz_abs.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch(`${window.dataRozhlasBaseUrl}data/tooltip_long.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
  ]).then(([dataLongMzStd, dataLongMzAbs, dataTooltipLong]) => {
    return {
      dataMzStd: dataLongMzStd,
      dataMzAbs: dataLongMzAbs,
      dataTooltip: dataTooltipLong,
    };
  });
};

document.addEventListener('DOMContentLoaded', stoletiExplorace);
