import * as d3 from 'd3';

import * as axes from './axes';
import * as colors from './colors';
import * as lines from './lines';
import * as texts from './texts';

export const fadeInLegend = (viz) => {
  const vizContainerEl = viz.svg.node().parentNode;

  const legendContainerEl = document.createElement('div');
  legendContainerEl.classList.add('prvni-republika-pribehy-legend');
  legendContainerEl.style.maxHeight = `${viz.height - 50}px`;
  vizContainerEl.append(legendContainerEl);

  const titleEl = document.createElement('span');
  titleEl.classList.add('legend-title');
  titleEl.textContent = '22 skupin příčin úmrtí';
  legendContainerEl.append(titleEl);

  const scrollContainerEl = document.createElement('div');
  scrollContainerEl.classList.add('legend-scroll-container');
  legendContainerEl.append(scrollContainerEl);

  const legendItems = viz.data1919MzStd
    .filter((category) => category.skupina !== 'Celkem')
    .map((category) => ({ categoryName: category.skupina, label: texts.categoriesShortLabels[category.skupina] }));

  legendItems.sort((a, b) => {
    return new Intl.Collator('cs').compare(a.label, b.label);
  });

  const handleLegendItemMouseover = (legendItem) => {
    if (!lines.isAddedCategoryLine(viz, { categoryName: legendItem.categoryName })) {
      return;
    }

    const data1919MzStdWithoutTotal = viz.data1919MzStd.filter((category) => category.skupina !== 'Celkem');

    data1919MzStdWithoutTotal.forEach((category) => {
      const categoryName = category.skupina;

      if (lines.isAddedCategoryLine(viz, { categoryName })) {
        lines.changeCategoryLine({
          svg: viz.svg,
          categoryName,
          style: categoryName === legendItem.categoryName ? 'active' : 'context',
          activeColor: colors.categoryColorsActive[categoryName],
        });
      }
    });

    lines.bringCategoryLineToFront({ svg: viz.svg, categoryName: legendItem.categoryName });
  };

  const handleLegendItemMouseout = () => {
    const data1919MzStdWithoutTotal = viz.data1919MzStd.filter((category) => category.skupina !== 'Celkem');

    data1919MzStdWithoutTotal.forEach((category) => {
      const categoryName = category.skupina;

      if (lines.isAddedCategoryLine(viz, { categoryName })) {
        lines.changeCategoryLine({
          svg: viz.svg,
          categoryName,
          style: 'active',
          activeColor: colors.categoryColorsActive[categoryName],
        });
      }
    });
  };

  const handleLegendItemCheckboxChange = (legendItem) => {
    const checkboxEls = scrollContainerEl.querySelectorAll('input[type=checkbox]');

    const showCategoryNames = [];
    checkboxEls.forEach((checkboxEl) => {
      if (checkboxEl.checked) {
        showCategoryNames.push(checkboxEl.dataset.categoryName);
      }
    });

    // Prep custom scale and line function

    const data1919MzStdShow = viz.data1919MzStd.filter((category) => showCategoryNames.includes(category.skupina));

    const yCustom = d3
      .scaleLinear()
      .domain([0, d3.max(data1919MzStdShow.map((category) => d3.max(category.data.map((d) => d.value))))])
      .nice()
      .range([viz.height - viz.marginExplore.bottom, viz.marginExplore.top]);

    const lineCustom = d3
      .line()
      .x((d) => viz.xExplore(d3.timeParse('%Y')(d.rok)))
      .y((d) => yCustom(d.value ? d.value : 0));

    // Update Y axis according to shown lines

    axes.updateYAxis(viz, { y: yCustom, margin: viz.marginExplore });

    // Add or remove respective lines

    const data1919MzStdWithoutTotal = viz.data1919MzStd.filter((category) => category.skupina !== 'Celkem');

    data1919MzStdWithoutTotal.forEach((category) => {
      const categoryName = category.skupina;
      const show = showCategoryNames.includes(categoryName);
      const isAdded = lines.isAddedCategoryLine(viz, { categoryName });

      if (show && !isAdded) {
        lines.addCategoryLine({
          svg: viz.svg,
          categoryName,
          d: lineCustom(category.data),
          style: 'active',
          activeColor: colors.categoryColorsActive[categoryName],
        });
      } else if (show && isAdded) {
        lines.changeCategoryLine({
          svg: viz.svg,
          categoryName,
          d: lineCustom(category.data),
          style: 'active',
          activeColor: colors.categoryColorsActive[categoryName],
          duration: 700,
        });
      } else if (!show && isAdded) {
        lines.removeCategoryLine({
          svg: viz.svg,
          categoryName,
        });
      }
    });
  };

  legendItems.forEach((legendItem) => {
    const labelEl = document.createElement('label');
    labelEl.classList.add('legend-item');

    // Add mouseover/out with delay so they do not screw up the animation
    window.setTimeout(() => {
      labelEl.addEventListener('mouseover', () => handleLegendItemMouseover(legendItem));
      labelEl.addEventListener('mouseout', () => handleLegendItemMouseout());
    }, 1400);

    scrollContainerEl.append(labelEl);

    const checkboxEl = document.createElement('input');
    checkboxEl.setAttribute('type', 'checkbox');
    checkboxEl.checked = true;
    checkboxEl.dataset.categoryName = legendItem.categoryName;
    checkboxEl.addEventListener('change', () => handleLegendItemCheckboxChange(legendItem));
    labelEl.append(checkboxEl);

    const customCheckboxEl = document.createElement('span');
    customCheckboxEl.classList.add('custom-checkbox');
    customCheckboxEl.setAttribute('style', `color: ${colors.categoryColorsActive[legendItem.categoryName]}`);
    labelEl.append(customCheckboxEl);

    const labelTextEl = document.createElement('span');
    labelTextEl.classList.add('label-text');
    labelTextEl.textContent = legendItem.label;
    labelEl.append(labelTextEl);
  });

  window.setTimeout(() => {
    legendContainerEl.classList.add('legend-show');
  }, 700);
};

export const fadeOutLegend = (viz) => {
  const vizContainerEl = viz.svg.node().parentNode;

  const legendContainerEl = vizContainerEl.querySelector('.prvni-republika-pribehy-legend');
  legendContainerEl.classList.remove('legend-show');

  window.setTimeout(() => {
    legendContainerEl.remove();
  }, 700);
};

export const isAddedLegend = (viz) => {
  const vizContainerEl = viz.svg.node().parentNode;

  return !!vizContainerEl.querySelector('.prvni-republika-pribehy-legend');
};

export const removeLegend = (viz) => {
  const vizContainerEl = viz.svg.node().parentNode;

  const legendContainerEl = vizContainerEl.querySelector('.prvni-republika-pribehy-legend');
  legendContainerEl.remove();
};
