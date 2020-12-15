import invert from 'lodash/invert';

export const categoriesShortLabels = {
  'Nemoci nakažlivé a cizopasné': 'Infekční nemoci',
  'Rakovina a jiné nádory': 'Novotvary',
  'Nemoci rheumatické, výživové, žláz s vnitřním vyměšováním, jiné nemoci celkové a avitaminos': 'Nemoci žláz a výživy',
  'Nemoci krve a ústrojů krvetvorných': 'Nemoci krve',
  'Nemoci ústrojí oběhu krevního': 'Nemoci oběhové soustavy',
  'Nemoci ústrojů dýchacích': 'Nemoci dýchací soustavy',
  'Nemoci ústrojí zažívacího': 'Nemoci trávicí soustavy',
  'Nemoci ústrojí močového a pohlavního': 'Nemoci močopohlavní soustavy',
  'Nemoci těhotenství, porodu a stavu poporodního': 'Těhotenství a porod',
  'Nemoci kůže a vaziva podkožního': 'Nemoci kůže',
  'Nemoci kostí a ústrojí pohybu': 'Nemoci kostí a svalů',
  'Vrozené vady vývojové': 'Vývojové vady',
  'Zvláštní nemoci útlého věku': 'Novorozenecké nemoci',
  Sebevraždy: 'Sebevraždy',
  'Vraždy a zabití': 'Napadení',
  'Úrazy při dopravě': 'Dopravní nehody',
  'Úrazy a otravy mimo dopravu': 'Úrazy mimo dopravu',
  'Válečné akce a soudní poprava': 'Popravy a války',
  'Neurčité příčiny smrti': 'Neurčité příčiny smrti',
  'Stařecká sešlost': 'Stařecká sešlost',
  'Nemoci soustavy nervové a smyslových ústrojů': 'Nemoci soustavy nervové a smyslových ústrojů',
  'Otravy vleklé': 'Otravy vleklé',
};

export const categoriesShortLabelsInverted = invert(categoriesShortLabels);
