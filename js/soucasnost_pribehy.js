import debounce from 'lodash/debounce';

import { default as datarozhlasScrolly, initDots } from './datarozhlas_scrolly';
import { initViz } from './soucasnost_pribehy_viz';

const soucasnostPribehy = async () => {
  const data = await fetchData();

  const dots = initDots('.soucasnost-pribehy-scrolly');

  let viz = initViz('.soucasnost-pribehy-scrolly .soucasnost-pribehy-viz', data);
  let scrolly = datarozhlasScrolly('.soucasnost-pribehy-scrolly', {
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

      viz = initViz('.soucasnost-pribehy-scrolly .soucasnost-pribehy-viz', data);
      scrolly = datarozhlasScrolly('.soucasnost-pribehy-scrolly', {
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
    fetch('data/1990_mz_std.json').then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch('data/1990_mz_abs.json').then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch('data/tooltip_2018.json').then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
  ]).then(([data1990MzStd, data1990MzAbs, dataTooltip2018]) => {
    return {
      dataMzStd: data1990MzStd,
      dataMzAbs: data1990MzAbs,
      dataTooltip: dataTooltip2018,
    };
  });
};

const filterDataToNeededYears = (data) => {
  return data.map((category) => {
    return {
      ...category,
      data: category.data.filter((d) => d.rok >= 1990),
    };
  });
};

document.addEventListener('DOMContentLoaded', soucasnostPribehy);
