import throttle from 'lodash/throttle';

const customNavbar = () => {
  const navbarEl = document.createElement('div');
  navbarEl.classList.add('priciny-umrti-custom-navbar');
  navbarEl.innerHTML = `
    <a href="/" class="irozhlas-logo">${irozhlasLogoSvg}</a>
    <button class="chapter-mobile-dropdown">Úvod</button>
    <nav class="toc" aria-label="Kapitoly">
      <ol>
        <li><a data-chapter="0" class="active" href="#top">Úvod</a></li>
        <li><a data-chapter="1" href="#za-cisare-pana">Za císaře pána</a></li>
        <li><a data-chapter="2" href="#prvni-republika">První republika</a></li>
        <li><a data-chapter="3" href="#komunismus">Komunismus</a></li>
        <li><a data-chapter="4" href="#soucasnost">Současnost</a></li>
        <li><a data-chapter="5" href="#do-strev">Do střev</a></li>
        <li><a data-chapter="6" href="#covidova-poprve">Covidová poprvé</a></li>
      </ol>
    </nav>
  `;

  document.body.append(navbarEl);

  const chapterMobileDropdownEl = navbarEl.querySelector('.chapter-mobile-dropdown');

  chapterMobileDropdownEl.addEventListener('click', () => {
    if (navbarEl.classList.contains('chapter-mobile-dropdown-open')) {
      navbarEl.classList.remove('chapter-mobile-dropdown-open');
    } else {
      navbarEl.classList.add('chapter-mobile-dropdown-open');
    }
  });

  const chapters = {
    0: document.querySelector('#top'),
    1: document.querySelector('#za-cisare-pana'),
    2: document.querySelector('#prvni-republika'),
    3: document.querySelector('#komunismus'),
    4: document.querySelector('#soucasnost'),
    5: document.querySelector('#do-strev'),
    6: document.querySelector('#covidova-poprve'),
  };

  let scrollingTimeout = null;
  // let lastLastScrollTop = document.documentElement.scrollTop;
  let lastScrollTop = document.documentElement.scrollTop;
  let scrollUp = 0;

  const onScroll = () => {
    if (scrollingTimeout !== null) {
      return;
    }

    const hideMobileNavbar = !(window.scrollY <= 0 || scrollUp > 250);
    if (hideMobileNavbar && !navbarEl.classList.contains('mobile-hide')) {
      navbarEl.classList.add('mobile-hide');
    } else if (!hideMobileNavbar && navbarEl.classList.contains('mobile-hide')) {
      navbarEl.classList.remove('mobile-hide');
    }

    if (lastScrollTop > document.documentElement.scrollTop) {
      scrollUp += lastScrollTop - document.documentElement.scrollTop;
    } else {
      scrollUp = 0;
    }

    lastScrollTop = document.documentElement.scrollTop;

    const { y: chapter1Y } = chapters['1'].getBoundingClientRect();
    const { y: chapter2Y } = chapters['2'].getBoundingClientRect();
    const { y: chapter3Y } = chapters['3'].getBoundingClientRect();
    const { y: chapter4Y } = chapters['4'].getBoundingClientRect();
    const { y: chapter5Y } = chapters['5'].getBoundingClientRect();
    const { y: chapter6Y } = chapters['6'].getBoundingClientRect();

    let activeChapter = 0;
    if (chapter6Y < 60) {
      activeChapter = 6;
    } else if (chapter5Y < 60) {
      activeChapter = 5;
    } else if (chapter4Y < 60) {
      activeChapter = 4;
    } else if (chapter3Y < 60) {
      activeChapter = 3;
    } else if (chapter2Y < 60) {
      activeChapter = 2;
    } else if (chapter1Y < 60) {
      activeChapter = 1;
    }

    navbarEl.querySelectorAll('.toc ol li a').forEach((linkEl) => {
      const chapter = parseInt(linkEl.dataset.chapter, 10);

      if (chapter === activeChapter) {
        linkEl.classList.add('active');
        chapterMobileDropdownEl.textContent = linkEl.textContent;
      } else {
        linkEl.classList.remove('active');
      }
    });
  };

  navbarEl.querySelectorAll('.toc ol li a').forEach((linkEl) => {
    linkEl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const { top: bodyTop } = document.body.getBoundingClientRect();

      const activeChapter = String(linkEl.dataset.chapter);
      const chapterEl = chapters[activeChapter];
      const { top: chapterTop } = chapterEl.getBoundingClientRect();

      document.location.hash = linkEl.getAttribute('href');

      window.scrollTo({ top: chapterTop - bodyTop - 50, left: 0, behavior: 'smooth' });

      navbarEl.querySelectorAll('.toc ol li a').forEach((linkEl) => {
        const chapter = linkEl.dataset.chapter;

        if (chapter === activeChapter) {
          linkEl.classList.add('active');
          chapterMobileDropdownEl.textContent = linkEl.textContent;
        } else {
          linkEl.classList.remove('active');
        }
      });

      navbarEl.classList.remove('chapter-mobile-dropdown-open');

      if (scrollingTimeout !== null) {
        window.clearTimeout(scrollingTimeout);
      }
      scrollingTimeout = window.setTimeout(() => {
        scrollingTimeout = null;
        onScroll();
      }, 1000);
    });
  });

  window.addEventListener('scroll', throttle(onScroll, 100));
  onScroll();
};

document.addEventListener('DOMContentLoaded', customNavbar);

const irozhlasLogoSvg = `
  <svg viewBox="0 0 373 54" width="100%" height="100%"><path d="M19.811 16H5.65v3.887l5.346 1.32v26.587L5.65 49.112V53h19.506v-3.888l-5.345-1.318zm-4.442-6c1.611 0 2.853-.455 3.725-1.362.873-.91 1.309-2.109 1.309-3.604 0-1.492-.448-2.702-1.342-3.636C18.166.466 16.936 0 15.369 0s-2.785.466-3.658 1.398c-.872.935-1.308 2.145-1.308 3.636 0 1.494.424 2.693 1.275 3.604.85.907 2.08 1.362 3.691 1.362zM62.37 33.07a20.44 20.44 0 0 0-1.494-2.048 22.124 22.124 0 0 0-1.076-1.217c1.62-.369 2.95-.855 3.991-1.458a24.43 24.43 0 0 0 2.812-1.875c1.619-1.25 2.903-2.813 3.853-4.689.948-1.874 1.423-3.782 1.423-5.729 0-1.943-.486-3.863-1.457-5.764-.972-1.898-2.291-3.447-3.958-4.652a13.776 13.776 0 0 0-4.512-2.015C60.287 3.209 58.342 3 56.121 3H30.158v4.028L36 8.486v39.027l-5.842 1.459V53h21.451v-4.027l-6.595-1.459V31.126h6.665l9.094 17.847V53h16.382v-4.027l-6.178-1.319L62.37 33.07zm-9.512-7.014h-7.844V8.069h7.567c2.822 0 4.998.603 6.525 1.806a8.958 8.958 0 0 1 2.222 2.848c.555 1.111.833 2.36.833 3.75 0 1.53-.267 2.952-.798 4.27-.532 1.321-1.262 2.374-2.187 3.159-1.667 1.437-3.773 2.154-6.318 2.154zM117.641 8.19a18.047 18.047 0 0 0-7.324-4.477c-2.801-.901-6.074-1.353-9.822-1.353-3.935 0-7.254.484-9.962 1.457a17.502 17.502 0 0 0-6.977 4.582c-2.221 2.361-3.935 5.301-5.137 8.816-1.204 3.518-1.805 7.312-1.805 11.385s.602 7.786 1.805 11.142c1.203 3.356 2.822 6.074 4.859 8.157 1.897 1.943 4.223 3.401 6.977 4.374 2.753.971 6.097 1.456 10.032 1.456 3.933 0 7.276-.485 10.03-1.456 2.753-.973 5.125-2.5 7.116-4.582 2.406-2.499 4.165-5.52 5.275-9.061 1.012-3.224 1.666-7.003 1.666-11.142a35.96 35.96 0 0 0-1.562-10.585c-1.041-3.402-2.765-6.304-5.171-8.713zm-4.304 29.748c-.648 2.616-1.574 4.732-2.777 6.353-2.221 3.054-5.508 4.581-9.857 4.581-2.454 0-4.502-.439-6.144-1.319-1.644-.878-3.02-2.175-4.13-3.886-1.157-1.76-2.072-4.027-2.742-6.804-.672-2.777-1.007-5.972-1.007-9.581 0-6.942 1.295-12.124 3.887-15.55a11.295 11.295 0 0 1 3.957-3.366c1.573-.809 3.472-1.215 5.692-1.215 2.176 0 4.131.418 5.866 1.249 1.735.832 3.205 2.129 4.408 3.889 1.203 1.757 2.14 3.979 2.812 6.664.67 2.684 1.007 5.855 1.007 9.511 0 3.702-.324 6.86-.972 9.474zm46.336 9.854h-22.144l28.809-40.556V3h-37.417v15.763h5.692l2.221-10.554h18.744l-28.809 40.555V53h41.166V36.472h-6.04zM205 7.028l5.832 1.458v16.322H190V8.486l5.857-1.458V3h-20.688v4.028L181 8.486v39.028l-5.831 1.459V53h20.688v-4.027L190 47.514V29.876h20.832v17.638L205 48.973V53h20.687v-4.027l-5.833-1.459V8.486l5.833-1.458V3H205zm60.823 40.764h-16.799V8.486l7.22-1.458V3h-22.77v4.028l6.525 1.458v39.028l-6.525 1.459V53h40.61V35.779h-5.901zm42.569-45.467h-8.538l-16.245 45.19-5.692 1.458V53h18.327v-4.026l-5.763-1.458 3.609-10.76h16.938l3.542 10.76-5.692 1.458V53h21.173v-4.026l-5.554-1.458-16.105-45.191zm-12.565 29.363l6.803-20.201h.276l6.458 20.201h-13.537zm72.745 3.462c-.557-1.342-1.448-2.614-2.675-3.818-1.227-1.203-2.845-2.383-4.857-3.541-2.014-1.156-4.479-2.406-7.395-3.749a179.07 179.07 0 0 1-4.895-2.29c-1.318-.647-2.384-1.308-3.193-1.979-.81-.67-1.387-1.423-1.734-2.255-.346-.834-.521-1.851-.521-3.056 0-4.95 2.615-7.428 7.844-7.428 3.378 0 5.878 1.041 7.498 3.125 1.619 2.083 2.429 5.299 2.429 9.648h6.041v-16.8h-5.97l-.556 3.124c-2.871-2.592-6.595-3.886-11.178-3.886-4.627 0-8.319 1.225-11.072 3.679-2.753 2.453-4.131 5.923-4.131 10.413 0 2.036.301 3.782.904 5.24a11.55 11.55 0 0 0 2.637 3.887c1.156 1.135 2.58 2.152 4.271 3.056 1.688.902 3.619 1.794 5.797 2.672 1.849.788 3.538 1.527 5.065 2.222 1.528.695 2.848 1.447 3.957 2.257 1.11.809 1.968 1.723 2.569 2.742s.903 2.245.903 3.678c0 2.361-.788 4.085-2.362 5.173-1.573 1.088-3.679 1.632-6.315 1.632-1.667 0-3.16-.221-4.479-.66s-2.464-1.169-3.437-2.188c-.971-1.017-1.746-2.336-2.324-3.957-.58-1.619-.938-3.585-1.077-5.9H334v16.8h5.97l.765-4.026c1.434 1.667 3.065 2.881 4.895 3.646 1.827.762 4.06 1.145 6.698 1.145 2.361 0 4.583-.29 6.664-.868 2.082-.577 3.898-1.457 5.45-2.638a12.471 12.471 0 0 0 3.644-4.408c.878-1.758 1.32-3.794 1.32-6.109-.001-1.713-.28-3.242-.834-4.583z"></path></svg>
`;
