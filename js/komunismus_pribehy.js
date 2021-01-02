import debounce from 'lodash/debounce';

import { default as datarozhlasScrolly, initDots } from './datarozhlas_scrolly';
import { initViz } from './komunismus_pribehy_viz';

const komunismusPribehy = async () => {
  const data = await fetchData();

  const dots = initDots('.komunismus-pribehy-scrolly');

  let viz = initViz('.komunismus-pribehy-scrolly .komunismus-pribehy-viz', data);
  let scrolly = datarozhlasScrolly('.komunismus-pribehy-scrolly', {
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

      viz = initViz('.komunismus-pribehy-scrolly .komunismus-pribehy-viz', data);
      scrolly = datarozhlasScrolly('.komunismus-pribehy-scrolly', {
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
    fetch(`${window.dataRozhlasBaseUrl}data/1949_mz_std.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch(`${window.dataRozhlasBaseUrl}data/1949_m_std.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch(`${window.dataRozhlasBaseUrl}data/1949_z_std.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch(`${window.dataRozhlasBaseUrl}data/1949_mz_abs.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch(`${window.dataRozhlasBaseUrl}data/tooltip_1989.json`).then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
  ]).then(([data1949MzStd, data1949MStd, data1949ZStd, data1949MzAbs, dataTooltip1989]) => {
    return {
      data1949MzStd,
      data1949MStd: filterDataToNeededYears(data1949MStd),
      data1949ZStd: filterDataToNeededYears(data1949ZStd),
      data1949MzAbs,
      dataTooltip1989,
    };
  });
};

const filterDataToNeededYears = (data) => {
  return data.map((category) => {
    return {
      ...category,
      data: category.data.filter((d) => d.rok <= 1989),
    };
  });
};

document.addEventListener('DOMContentLoaded', komunismusPribehy);
