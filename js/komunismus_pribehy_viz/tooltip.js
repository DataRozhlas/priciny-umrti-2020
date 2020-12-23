import * as d3 from 'd3';
import kebabCase from 'lodash/kebabCase';
import { createPopper } from '@popperjs/core';

import * as texts from './texts';

export const createTooltipTriggersGroup = (viz) => {
  viz.svg.append('g').attr('class', 'g-tooltip-triggers');
};

export const getTooltipTriggersGroup = (viz) => viz.svg.select('.g-tooltip-triggers');

export const updateCategoryLineTooltipTriggers = (viz, { categoryName, x, y, activeColor }) => {
  const tooltipTriggersGroup = getTooltipTriggersGroup(viz);

  let categoryLineGroup = tooltipTriggersGroup.select(`.${kebabCase(categoryName)}`);
  if (categoryLineGroup.empty()) {
    categoryLineGroup = tooltipTriggersGroup
      .append('g')
      .attr('class', kebabCase(categoryName))
      .attr('color', activeColor);
  }

  const categoryData = viz.dataMzStd.find((category) => category.skupina === categoryName).data;

  const radius = 4;

  categoryLineGroup
    .selectAll('dot')
    .data(categoryData)
    .enter()
    .append('circle')
    .attr('r', radius)
    .attr('cx', function (d) {
      return x(d3.timeParse('%Y')(d.rok));
    })
    .attr('cy', function (d) {
      return y(d.value);
    })
    .on('mouseover', function (e, datum) {
      e.currentTarget.classList.add('active');

      showTooltip(viz, { categoryName, datum, tooltipTriggerEl: e.currentTarget });
    })
    .on('mouseout', function (e, datum) {
      e.currentTarget.classList.remove('active');

      hideTooltip(viz);
    });
};

export const removeCategoryLineTooltipTriggers = (viz, { categoryName }) => {
  const tooltipTriggersGroup = getTooltipTriggersGroup(viz);

  const categoryLineGroup = tooltipTriggersGroup.select(`.${kebabCase(categoryName)}`);
  if (categoryLineGroup) {
    categoryLineGroup.remove();
  }
};

const showTooltip = (viz, { categoryName, datum, tooltipTriggerEl }) => {
  const { rok: year, value: stdValue } = datum;
  const { absValue, diagnoses } = viz.tooltipData[categoryName][year];

  const tooltipEl = document.createElement('div');
  tooltipEl.classList.add('priciny-umrti-pribehy-viz-tooltip');
  tooltipEl.innerHTML = `
    <div class="tooltip-arrow" data-popper-arrow></div>
    <div class="tooltip-title">
      <span class="tooltip-title-category">${texts.categoriesShortLabels[categoryName]}</span><br>
      v&nbsp;roce&nbsp;<span class="tooltip-title-year">${year}</span>
    </div>
    <div class="tooltip-numbers">
      <div class="tooltip-numbers-abs">
        <div class="tooltip-numbers-abs-value">${formatNumber(absValue)}</div>
        <div class="tooltip-numbers-desc">úmrtí</div>
      </div>
      <div class="tooltip-numbers-std">
        <div class="tooltip-numbers-std-value">${formatNumber(stdValue)}</div>
        <div class="tooltip-numbers-desc">na 100 tisíc (std. k 1989)</div>
      </div>
    </div>
    <div class="tooltip-diagnoses">
      <div class="tooltip-diagnoses-header">Nejčastější diagnózy</div>
      <ol class="tooltip-diagnoses-list"></ol>
    </div>
  `;
  document.body.append(tooltipEl);

  const diagnosesListEl = tooltipEl.querySelector('.tooltip-diagnoses-list');
  diagnoses.forEach((diagnosis) => {
    diagnosesListEl.innerHTML += `
      <li>${diagnosis.name} <span class="tooltip-diagnosis-abs-value">/&nbsp;${diagnosis.absValue}&nbsp;úmrtí</span></li>
    `;
  });

  createPopper(tooltipTriggerEl, tooltipEl, {
    placement: 'right-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: ({ placement }) => {
            if (placement === 'right-start') {
              return [-48, 15];
            } else if (placement === 'right-end') {
              return [15, 15];
            } else {
              return [0, 15];
            }
          },
        },
      },
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['right-end', 'left-start', 'left-end'],
        },
      },
    ],
  });
};

const hideTooltip = () => {
  const tooltipEl = document.querySelector('.priciny-umrti-pribehy-viz-tooltip');
  if (tooltipEl) {
    tooltipEl.remove();
  }
};

export const prepareTooltipData = ({ dataMzAbs, dataTooltip }) => {
  const tooltipData = {};

  dataMzAbs.forEach((category) => {
    const categoryName = category.skupina;

    if (!tooltipData[categoryName]) {
      tooltipData[categoryName] = {};
    }

    category.data.forEach((datum) => {
      const { rok: year, value } = datum;

      tooltipData[categoryName][year] = {
        absValue: value,
      };
    });
  });

  dataTooltip.forEach((category) => {
    const categoryName = category.skupina;
    const year = category.rok;

    if (!tooltipData[categoryName]) {
      tooltipData[categoryName] = {};
    }
    if (!tooltipData[categoryName][year]) {
      tooltipData[categoryName][year] = {};
    }

    tooltipData[categoryName][year].diagnoses = [];
    category.data.forEach((datum) => {
      const { nazev: name, celkem: absValue } = datum;

      tooltipData[categoryName][year].diagnoses.push({
        name,
        absValue,
      });
    });
  });

  return tooltipData;
};

const formatNumber = (number) => number.toLocaleString('cs-CZ').replace(' ', '\u2009');
