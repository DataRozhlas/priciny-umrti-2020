import 'intersection-observer';
import scrollama from 'scrollama';
import debounce from 'lodash/debounce';

const ilustraceKapitol = () => {
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-1');
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-2');
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-3');
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-4');
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-5');
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

  const frameElements = document.querySelectorAll(`${containerSelector} img`);

  const scroller = scrollama();

  scroller
    .setup({
      offset: 0.4,
      step: `${containerSelector} .priciny-umrti-ilustrace-kapitoly-steps-container .priciny-umrti-ilustrace-kapitoly-step`,
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
        const { width } = containerEl.getBoundingClientRect();
        const height = width * heightToWidthRatio;
        containerEl.style.height = `${height}px`;

        scroller.resize(e);

        windowInnerWidthBefore = window.innerWidth;
      }
    }, 200)
  );
};

document.addEventListener('DOMContentLoaded', ilustraceKapitol);
