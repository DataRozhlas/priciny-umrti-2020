import debounce from 'lodash/debounce';

import { default as datarozhlasScrolly, initDots } from './datarozhlas_scrolly';
import { initViz } from './prvni_republika_pribehy_viz';

const prvniRepublikaPribehy = async () => {
  const data = await fetchData();

  const dots = initDots('.prvni-republika-pribehy-scrolly');

  let viz = initViz('.prvni-republika-pribehy-scrolly .prvni-republika-pribehy-viz', data);
  let scrolly = datarozhlasScrolly('.prvni-republika-pribehy-scrolly', {
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

      viz = initViz('.prvni-republika-pribehy-scrolly .prvni-republika-pribehy-viz', data);
      scrolly = datarozhlasScrolly('.prvni-republika-pribehy-scrolly', {
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
    fetch(`${window.dataRozhlasBaseUrl}data/1919_mz_std.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch(`${window.dataRozhlasBaseUrl}data/1919_m_std.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch(`${window.dataRozhlasBaseUrl}data/1919_z_std.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch(`${window.dataRozhlasBaseUrl}data/1919_mz_abs.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch(`${window.dataRozhlasBaseUrl}data/tooltip_1948.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
  ]).then(([data1919MzStd, data1919MStd, data1919ZStd, data1919MzAbs, dataTooltip1948]) => {
    return { data1919MzStd, data1919MStd, data1919ZStd, data1919MzAbs, dataTooltip1948 };
  });
};

document.addEventListener('DOMContentLoaded', prvniRepublikaPribehy);
