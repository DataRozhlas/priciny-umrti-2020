const topMknDiagnozy = () => {
  const contentEls = document.querySelectorAll(
    '.priciny-umrti-top-mkn-diagnozy .priciny-umrti-top-mkn-diagnozy-obsah > *'
  );
  const timelineButtonEls = document.querySelectorAll(
    '.priciny-umrti-top-mkn-diagnozy .priciny-umrti-top-mkn-diagnozy-osa button'
  );

  timelineButtonEls.forEach((buttonEl) => {
    buttonEl.addEventListener('click', () => {
      const activeMkn = buttonEl.dataset.mkn;

      timelineButtonEls.forEach((buttonEl) => {
        if (buttonEl.dataset.mkn === activeMkn) {
          buttonEl.dataset.mknActive = true;
        } else {
          delete buttonEl.dataset.mknActive;
        }
      });

      contentEls.forEach((contentEl) => {
        if (contentEl.dataset.mkn === activeMkn) {
          contentEl.dataset.mknActive = true;
        } else {
          delete contentEl.dataset.mknActive;
        }
      });
    });
  });
};

document.addEventListener('DOMContentLoaded', topMknDiagnozy);
