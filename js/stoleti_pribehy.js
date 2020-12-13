import debounce from 'lodash/debounce';

import { default as datarozhlasScrolly, initDots } from './datarozhlas_scrolly';
import { initViz } from './stoleti_pribehy_viz';

const stoletiPribehy = async () => {
  const data = await fetchData();

  const dots = initDots('.stoleti-pribehy-scrolly');

  let viz = initViz('.stoleti-pribehy-scrolly .stoleti-pribehy-viz', data);
  let scrolly = datarozhlasScrolly('.stoleti-pribehy-scrolly', {
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

      viz = initViz('.stoleti-pribehy-scrolly .stoleti-pribehy-viz', data);
      scrolly = datarozhlasScrolly('.stoleti-pribehy-scrolly', {
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
    fetch('data/long_mz_std.json').then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
  ]).then(([dataLongMzStd]) => {
    return {
      dataLongMzStd,
    };
  });
};

document.addEventListener('DOMContentLoaded', stoletiPribehy);
