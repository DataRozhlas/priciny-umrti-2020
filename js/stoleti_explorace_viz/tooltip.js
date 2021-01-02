import * as d3 from 'd3';
import kebabCase from 'lodash/kebabCase';
import { createPopper } from '@popperjs/core';

import * as texts from './texts';

export const createTooltipTriggersGroup = (viz) => {
  viz.svg.append('g').attr('class', 'g-tooltip-triggers');
};

export const getTooltipTriggersGroup = (viz) => viz.svg.select('.g-tooltip-triggers');

export const updateCategoryLineTooltipTriggers = (
  viz,
  { categoryName, x, y, activeColor, duration = 0, delay = 0 }
) => {
  const tooltipTriggersGroup = getTooltipTriggersGroup(viz);

  let categoryLineGroup = tooltipTriggersGroup.select(`.${kebabCase(categoryName)}`);
  if (categoryLineGroup.empty()) {
    categoryLineGroup = tooltipTriggersGroup
      .append('g')
      .attr('class', `${kebabCase(categoryName)} style-active`)
      .attr('color', activeColor);
  }

  categoryLineGroup.transition().duration(duration).delay(delay).attr('color', activeColor);

  const categoryData = viz.dataMzStd.find((category) => category.skupina === categoryName).data;

  const radius = 2.5;
  const activeRadius = 4;
  let strokeWidth = 3;
  let activeStrokeWidth = 0;

  const yearPixels = Math.floor(
    x(d3.timeParse('%Y')(categoryData[1].rok)) - x(d3.timeParse('%Y')(categoryData[0].rok))
  );
  if (yearPixels > 5) {
    strokeWidth = (Math.min(16, yearPixels) / 2 - 2.5) * 2;
    activeStrokeWidth = strokeWidth - 3;
  }

  const updateSelection = categoryLineGroup.selectAll('circle').data(categoryData);

  updateSelection
    .enter()
    .append('circle')
    .attr('r', radius)
    .attr('stroke-width', strokeWidth)
    .attr('cx', function (d) {
      return x(d3.timeParse('%Y')(d.rok));
    })
    .attr('cy', function (d) {
      return y(d.value);
    })
    .on('mouseover', function (e, datum) {
      e.currentTarget.setAttribute('r', activeRadius);
      e.currentTarget.setAttribute('stroke-width', activeStrokeWidth);

      showTooltip(viz, { categoryName, datum, tooltipTriggerEl: e.currentTarget });
    })
    .on('mouseout', function (e, datum) {
      e.currentTarget.setAttribute('r', radius);
      e.currentTarget.setAttribute('stroke-width', strokeWidth);

      hideTooltip(viz);
    });

  updateSelection.exit().transition().duration(duration).delay(delay).remove();

  updateSelection
    .transition()
    .duration(duration)
    .delay(delay)
    .attr('cx', function (d) {
      return x(d3.timeParse('%Y')(d.rok));
    })
    .attr('cy', function (d) {
      return y(d.value);
    });
};

export const removeCategoryLineTooltipTriggers = (viz, { categoryName, delay = 0 }) => {
  const tooltipTriggersGroup = getTooltipTriggersGroup(viz);

  const categoryLineGroup = tooltipTriggersGroup.select(`.${kebabCase(categoryName)}`);
  if (!categoryLineGroup.empty()) {
    if (delay > 0) {
      categoryLineGroup.transition().delay(delay).remove();
    } else {
      categoryLineGroup.remove();
    }
  }
};

export const changeCategoryLineTooltipTriggersStyle = (viz, { categoryName, style }) => {
  const tooltipTriggersGroup = getTooltipTriggersGroup(viz);

  let categoryLineGroup = tooltipTriggersGroup.select(`.${kebabCase(categoryName)}`);
  if (!categoryLineGroup.empty()) {
    categoryLineGroup.attr('class', `${kebabCase(categoryName)} style-${style}`);
  }
};

export const areAddedCategoryLineTooltipTriggers = (viz, { categoryName }) => {
  const tooltipTriggersGroup = getTooltipTriggersGroup(viz);

  let categoryLineGroup = tooltipTriggersGroup.select(`.${kebabCase(categoryName)}`);

  return !categoryLineGroup.empty();
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
        <div class="tooltip-numbers-desc">na 100&nbsp;tisíc (std.&nbsp;k&nbsp;2018)</div>
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
            if (placement === 'right-start' || placement === 'left-start') {
              return [-48, 15];
            } else {
              return [15, 15];
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

export const hideTooltip = () => {
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
    let categoryName = category.skupina;
    const year = category.rok;

    if (year <= 1948) {
      categoryName = oldCategoryNamesToNewCategoryNamesMap[categoryName];
    }

    if (!tooltipData[categoryName]) {
      tooltipData[categoryName] = {};
    }
    if (!tooltipData[categoryName][year]) {
      tooltipData[categoryName][year] = {};
    }

    tooltipData[categoryName][year].diagnoses = [];
    category.data.forEach((datum) => {
      const { nazev: name, celkem: absValue } = datum;

      if (absValue > 0) {
        tooltipData[categoryName][year].diagnoses.push({
          name,
          absValue,
        });
      }
    });
  });

  return tooltipData;
};

const formatNumber = (number) => number.toLocaleString('cs-CZ').replace(' ', '\u2009');

const oldCategoryNamesToNewCategoryNamesMap = {
  'Nemoci nakažlivé a cizopasné': 'Některé infekční a parazitární nemoci',
  'Rakovina a jiné nádory': 'Novotvary',
  'Nemoci rheumatické, výživové, žláz s vnitřním vyměšováním, jiné nemoci celkové a avitaminos':
    'Nemoci endokrinní, výživy a přeměny látek',
  'Nemoci krve a ústrojů krvetvorných':
    'Nemoci krve, krvetvorných orgánů a některé poruchy týkající se mechanismu imunity',
  'Nemoci ústrojí oběhu krevního': 'Nemoci oběhové soustavy',
  'Nemoci ústrojů dýchacích': 'Nemoci dýchací soustavy',
  'Nemoci ústrojí zažívacího': 'Nemoci trávicí soustavy',
  'Nemoci ústrojí močového a pohlavního': 'Nemoci močové a pohlavní soustavy',
  'Nemoci těhotenství, porodu a stavu poporodního': 'Těhotenství, porod a šestinedělí',
  'Nemoci kůže a vaziva podkožního': 'Nemoci kůže a podkožního vaziva',
  'Nemoci kostí a ústrojí pohybu': 'Nemoci svalové a kosterní soustavy a pojivové tkáně',
  'Vrozené vady vývojové': 'Vrozené vady, deformace a chromosomální abnormality',
  'Zvláštní nemoci útlého věku': 'Některé stavy vzniklé v perinatálním období',
  Sebevraždy: 'Úmyslné sebepoškození',
  'Vraždy a zabití': 'Napadení (útok)',
  'Úrazy při dopravě': 'Dopravní nehody',
  'Úrazy a otravy mimo dopravu': 'Ostatní vnější příčiny poranění a otrav',
  'Válečné akce a soudní poprava': 'Zákonný zákrok a válečné operace',
  'Neurčité příčiny smrti': 'Příznaky, znaky a abnormální klinické a laboratorní nálezy nezařazené jinde',
  'Nemoci soustavy nervové a smyslových ústrojů': 'Nemoci nervové soustavy',
  'Otravy vleklé': 'Poruchy duševní a poruchy chování',
};
