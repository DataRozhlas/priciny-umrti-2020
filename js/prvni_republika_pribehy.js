import debounce from 'lodash/debounce';

import datarozhlasScrolly from './datarozhlas_scrolly';
import { initViz } from './prvni_republika_pribehy_viz';

const prvniRepublikaPribehy = async () => {
  const data = await fetchData();

  const dots = initDots();

  let viz = initViz('.prvni-republika-pribehy-viz', data);
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

      viz = initViz('.prvni-republika-pribehy-viz', data);
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

document.addEventListener('DOMContentLoaded', prvniRepublikaPribehy);

const fetchData = () => {
  return Promise.all([
    fetch('data/1919_mz_std.json').then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch('data/1919_m_std.json').then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
    fetch('data/1919_z_std.json').then((response) => {
      return !response.error ? response.json() : Promise.reject();
    }),
  ]).then(([data1919MzStd, data1919MStd, data1919ZStd]) => {
    return { data1919MzStd, data1919MStd, data1919ZStd };
  });
};

const initDots = () => {
  const dotsElement = document.querySelector('.prvni-republika-pribehy-dots');

  document
    .querySelectorAll('.prvni-republika-pribehy-scrolly .datarozhlas-scrolly-step')
    .forEach((stepElement, stepIndex) => {
      const dotButton = document.createElement('button');
      dotButton.classList.add('dot');
      dotButton.classList.add(`dot-step-${stepIndex}`);
      if (stepIndex === 0) {
        dotButton.classList.add('is-active');
      }

      dotButton.addEventListener('click', () => {
        window.scroll({
          top: window.scrollY + stepElement.getBoundingClientRect().top,
          left: 0,
          behavior: 'smooth',
        });
      });

      dotsElement.append(dotButton);
    });

  return {
    onScrollDownToStep: (index) => {
      dotsElement.querySelectorAll('.dot').forEach((dotElement) => {
        dotElement.classList.remove('is-active');

        if (dotElement.classList.contains(`dot-step-${index}`)) {
          dotElement.classList.add('is-active');
        }
      });
    },
    onScrollUpFromStep: (index) => {
      dotsElement.querySelectorAll('.dot').forEach((dotElement) => {
        dotElement.classList.remove('is-active');

        if (dotElement.classList.contains(`dot-step-${index - 1}`)) {
          dotElement.classList.add('is-active');
        }
      });
    },
  };
};
