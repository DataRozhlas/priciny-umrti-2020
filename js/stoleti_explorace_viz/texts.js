import invert from 'lodash/invert';

export const categoriesShortLabels = {
  'Některé infekční a parazitární nemoci': 'Infekční nemoci',
  Novotvary: 'Novotvary',
  'Nemoci endokrinní, výživy a přeměny látek': 'Nemoci žláz a výživy',
  'Nemoci krve, krvetvorných orgánů a některé poruchy týkající se mechanismu imunity': 'Nemoci krve',
  'Nemoci oběhové soustavy': 'Nemoci oběhové soustavy',
  'Nemoci dýchací soustavy': 'Nemoci dýchací soustavy',
  'Nemoci trávicí soustavy': 'Nemoci trávicí soustavy',
  'Nemoci močové a pohlavní soustavy': 'Nemoci močopohlavní soustavy',
  'Těhotenství, porod a šestinedělí': 'Těhotenství a porod',
  'Nemoci kůže a podkožního vaziva': 'Nemoci kůže',
  'Nemoci svalové a kosterní soustavy a pojivové tkáně': 'Nemoci kostí a svalů',
  'Vrozené vady, deformace a chromosomální abnormality': 'Vývojové vady',
  'Některé stavy vzniklé v perinatálním období': 'Novorozenecké nemoci',
  'Úmyslné sebepoškození': 'Sebevraždy',
  'Napadení (útok)': 'Napadení',
  'Dopravní nehody': 'Dopravní nehody',
  'Ostatní vnější příčiny poranění a otrav': 'Úrazy mimo dopravu',
  'Zákonný zákrok a válečné operace': 'Popravy a války',

  'Příznaky, znaky a abnormální klinické a laboratorní nálezy nezařazené jinde': 'Neurčité příčiny smrti',
  'Nemoci nervové soustavy': 'Nemoci nervové soustavy',
  'Poruchy duševní a poruchy chování': 'Duševní nemoci',
  'Nemoci oka a očních adnex': 'Nemoci oka',
  'Nemoci ucha a bradavkového výběžku': 'Nemoci ucha',
  'Komplikace zdravotní péče': 'Komplikace zdravotní péče',
};

export const categoriesShortLabelsInverted = invert(categoriesShortLabels);
