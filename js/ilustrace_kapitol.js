import "intersection-observer";
import scrollama from "scrollama";
import debounce from 'lodash/debounce'

const ilustraceKapitol = () => {
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-1', 771 / 1800)
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-2', 771 / 1800)
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-3', 771 / 1800)
  initIlustraceKapitolyScrolly('.priciny-umrti-kapitola-4', 771 / 1800)
}

const initIlustraceKapitolyScrolly = (containerSelector, heightToWidthRatio) => {
  const containerEl = document.querySelector(containerSelector)
  if (!containerEl) {
    console.error(`Could not find scrolly container by selector "${containerSelector}"`)
    return;
  }

  const { width } = containerEl.getBoundingClientRect()
  const height = width * heightToWidthRatio
  containerEl.style.height = `${height}px`;

  containerEl.querySelectorAll('img').forEach(() => {
    const stepElement = document.createElement('div')
    stepElement.classList.add('priciny-umrti-ilustrace-kapitoly-step')
    
    containerEl.append(stepElement)
  })

  const frameElements = document.querySelectorAll(`${containerSelector} img`);

  const scroller = scrollama();

  scroller
    .setup({
      offset: .5,
      step: `${containerSelector} .priciny-umrti-ilustrace-kapitoly-step`,
    })
    .onStepEnter(({ element, direction, index }) => {
      frameElements.forEach(el => el.classList.remove('active'))
      frameElements[index].classList.add('active')
    })

  window.addEventListener('resize', debounce(e => {
    const { width } = containerEl.getBoundingClientRect()
    const height = width * heightToWidthRatio
    containerEl.style.height = `${height}px`;

    scroller.resize(e)
  }, 200))
}

document.addEventListener('DOMContentLoaded', ilustraceKapitol);
