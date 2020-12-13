import 'intersection-observer';
import scrollama from 'scrollama';

export default function datarozhlasScrolly(containerSelector, { onScrollDownToStep, onScrollUpFromStep }) {
  const containerEl = document.querySelector(containerSelector);
  if (!containerEl) {
    console.error(`Could not find scrolly container by selector "${containerSelector}"`);
    return;
  }

  const stickyEl = containerEl.querySelector('.datarozhlas-scrolly-sticky');
  if (!stickyEl) {
    console.error(
      `Could not find sticky element with class .datarozhlas-scrolly-sticky under scrolly container specified by selector "${containerSelector}"`
    );
    return;
  }

  const firstStepEls = containerEl.querySelectorAll('.datarozhlas-scrolly-step');
  if (firstStepEls.length === 0) {
    console.error(
      `Could not find any step element with class .datarozhlas-scrolly-step under scrolly container specified by selector "${containerSelector}"`
    );
    return;
  }

  const { height: stepHeight } = firstStepEls[0].getBoundingClientRect();
  const viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  let lastKnownScrollPos = 0;
  let scrollListenerTicking = false;

  const onScroll = () => {
    lastKnownScrollPos = window.scrollY;

    if (!scrollListenerTicking) {
      window.requestAnimationFrame(() => {
        const { top: containerTop, height: containerHeight } = containerEl.getBoundingClientRect();
        const { height: stickyHeight } = stickyEl.getBoundingClientRect();

        // containerTop = 0 means the top of scrolly container is aligned with top
        // of viewport. containerTop > 0 means we are before the scrolly container,
        // containerTop < 0 means we are in or after the container.
        if (containerTop > 0) {
          stickyEl.style.bottom = null;
          stickyEl.style.top = String(containerTop + stepHeight) + 'px';
        } else if (containerTop + containerHeight < viewportHeight) {
          // stickyEl.style.bottom = String(viewportHeight - containerTop - containerHeight) + 'px'
          // stickyEl.style.top = null;
          stickyEl.style.top = String(containerHeight + containerTop - stickyHeight) + 'px';
          stickyEl.style.bottom = null;
        } else {
          stickyEl.style.bottom = '0px';
          stickyEl.style.top = null;
        }

        scrollListenerTicking = false;
      });

      scrollListenerTicking = true;
    }
  };

  const intersectionObserverCallback = (entries, observer) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      window.addEventListener('scroll', onScroll);

      const { width: stickyWidth } = stickyEl.getBoundingClientRect();

      stickyEl.style.cssText = `position: fixed; width: ${stickyWidth}px`;

      onScroll();
    } else {
      window.removeEventListener('scroll', onScroll);

      stickyEl.style.cssText = '';
    }
  };

  const observer = new IntersectionObserver(intersectionObserverCallback, {
    threshold: 0,
  });
  observer.observe(containerEl);

  const scroller = scrollama();

  scroller
    .setup({
      // debug: true,
      offset: '100px',
      step: `${containerSelector} .datarozhlas-scrolly-step`,
    })
    .onStepEnter(({ element, direction, index }) => {
      if (direction === 'down' && onScrollDownToStep) {
        console.log(`Calling onScrollDownToStep with index ${index}`);
        onScrollDownToStep(index);
      }

      if (direction === 'up' && onScrollUpFromStep) {
        console.log(`Calling onScrollUpFromStep with index ${index + 1}`);
        onScrollUpFromStep(index + 1);
      }
    });

  return {
    destroy: () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
      stickyEl.style.cssText = '';
      scroller.destroy();
    },
  };
}

export const initDots = (scrollySelector) => {
  const scrollyEl = document.querySelector(scrollySelector);
  const stickyEl = scrollyEl.querySelector('.datarozhlas-scrolly-sticky');

  const dotsElement = document.createElement('div');
  dotsElement.classList.add('datarozhlas-scrolly-dots');
  stickyEl.append(dotsElement);

  scrollyEl.querySelectorAll('.datarozhlas-scrolly-step').forEach((stepElement, stepIndex) => {
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
