import 'intersection-observer';
import scrollama from 'scrollama';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

const ilustraceKapitol = () => {
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-1');
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-2');
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-3');
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-4');
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-5');

  const chapter1 = document.querySelector('.priciny-umrti-kapitola-1');
  const chapter2 = document.querySelector('.priciny-umrti-kapitola-2');
  const chapter3 = document.querySelector('.priciny-umrti-kapitola-3');
  const chapter4 = document.querySelector('.priciny-umrti-kapitola-4');
  const chapter5 = document.querySelector('.priciny-umrti-kapitola-5');

  const triggerLoad = (chapterEl) => {
    chapterEl.querySelectorAll('img:not([data-loaded])').forEach((imgEl) => {
      imgEl.src = imgEl.dataset.src;
      imgEl.dataset.loaded = true;
    });
  };

  const onScroll = () => {
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const { y: chapter1Y } = chapter1.getBoundingClientRect();
    const { y: chapter2Y } = chapter2.getBoundingClientRect();
    const { y: chapter3Y } = chapter3.getBoundingClientRect();
    const { y: chapter4Y } = chapter4.getBoundingClientRect();
    const { y: chapter5Y } = chapter5.getBoundingClientRect();

    if (chapter1Y < vh * 2) {
      triggerLoad(chapter1);
    }
    if (chapter2Y < vh * 2) {
      triggerLoad(chapter2);
    }
    if (chapter3Y < vh * 2) {
      triggerLoad(chapter3);
    }
    if (chapter4Y < vh * 2) {
      triggerLoad(chapter4);
    }
    if (chapter5Y < vh * 2) {
      triggerLoad(chapter5);
    }
  };

  window.addEventListener('scroll', throttle(onScroll, 100));
  onScroll();
};

const initIlustraceKapitolyScrolly = (containerSelector) => {
  const containerEl = document.querySelector(containerSelector);
  if (!containerEl) {
    console.error(`Could not find scrolly container by selector "${containerSelector}"`);
    return;
  }

  const stepsContainerElement = document.createElement('div');
  stepsContainerElement.classList.add('priciny-umrti-ilustrace-kapitoly-steps-container');
  containerEl.append(stepsContainerElement);

  containerEl.querySelectorAll('img').forEach(() => {
    const stepElement = document.createElement('div');
    stepElement.classList.add('priciny-umrti-ilustrace-kapitoly-step');

    stepsContainerElement.append(stepElement);
  });

  const updateStepsContainerHeight = () => {
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const { height: containerHeight } = containerEl.getBoundingClientRect();

    let stepsContainerHeight = containerHeight + vh * 0.2;
    if (stepsContainerHeight > vh - containerHeight - 70) {
      stepsContainerHeight = vh - containerHeight - 70;
    }

    stepsContainerElement.style.height = `${stepsContainerHeight}px`;
  };
  updateStepsContainerHeight();

  const frameElements = document.querySelectorAll(`${containerSelector} img`);

  const scroller = scrollama();

  scroller
    .setup({
      offset: 0.5,
      step: `${containerSelector} .priciny-umrti-ilustrace-kapitoly-steps-container .priciny-umrti-ilustrace-kapitoly-step`,
      debug: true,
    })
    .onStepEnter(({ element, direction, index }) => {
      frameElements.forEach((el) => el.classList.remove('active'));
      frameElements[index].classList.add('active');
    });

  let windowInnerWidthBefore = window.innerWidth;
  window.addEventListener(
    'resize',
    debounce((e) => {
      if (window.innerWidth !== windowInnerWidthBefore) {
        updateStepsContainerHeight();

        scroller.resize(e);

        windowInnerWidthBefore = window.innerWidth;
      }
    }, 200)
  );
};

document.addEventListener('DOMContentLoaded', ilustraceKapitol);
