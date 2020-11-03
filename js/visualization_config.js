// Do budoucna budeme muset udělat ještě  mapu různých názvů napříč různými číselníky
export const colors = {
  // "default" : "#000",
  "visited" : "#AFB1A9",
  "default" : "#AFB1A9",
  "context" : "#E1E2DF",
  // "context" : "#0f0",

  "nemoci-nakažlivé-a-cizopasné" : "#f95d6a",
  "rakovina-a-jiné-nádory" : "#a05195",
  "nemoci-ústrojí-oběhu-krevního" : "#ffa600",
  "nemoci-rheumatické,-výživové,-žláz-s-vnitřním-vyměšováním,-jiné-nemoci-celkové-a-avitaminos" : "#000",
  "nemoci-krve-a-ústrojů-krvetvorných" : "#11a579",
  "otravy-vleklé" : "#3969ac",
  "nemoci-soustavy-nervové-a-smyslových-ústrojů" : "#f2b701",
  "nemoci-ústrojů-dýchacích" : "#e73f74",
  "nemoci-ústrojí-zažívacího" : "#80ba5a",
  "nemoci-ústrojí-močového-a-pohlavního" : "#e68310",
  "nemoci-kůže-a-vaziva-podkožního" : "#008695",
  "nemoci-kostí-a-ústrojí-pohybu" : "#cf1c90",
  "vrozené-vady-vývojové" : "#f97b72",
  "zvláštní-nemoci-útlého-věku" : "#4b4b8f",
  "stařecká-sešlost" : "#a5aa99",
  "sebevraždy" : "#0ebcbf",
  "vraždy-a-zabití" : "#5158bb",
  "úrazy-při-dopravě" : "#9e52aa",
  "úrazy-a-otravy-mimo-dopravu" : "#eb4776",
  "válečné-akce-a-soudní-poprava" : "#665191",
  "neurčité-příčiny-smrti" : "#f58a5a",
  
}

export const animationDuration = 100;

export const getCategoryColor = (category) => {
  return colors[category] ? colors[category] : colors["default"]
}

export const labelPosition = {
  "nemoci-nakažlivé-a-cizopasné" : { x: 1927, y: 250 },
  "nemoci-ústrojí-oběhu-krevního" : { x: 1929, y: 380 },
  "rakovina-a-jiné-nádory" : { x: 1933, y: 220 },
  "válečné-akce-a-soudní-poprava" :  { x: 1935, y: 100 },
  "stařecká-sešlost" :  { x: 1923, y: 500 },
  "nemoci-ústrojů-dýchacích" :  { x: 1937, y: 150 },
  "nemoci-soustavy-nervové-a-smyslových-ústrojů" :  { x: 1921, y: 140 },
  "nemoci-ústrojí-zažívacího" :  { x: 1930, y: 75 },
  "sebevraždy" :  { x: 1922, y: 42 },


  "neurčité-příčiny-smrti" :  { x: 1938, y: 600 },
  "nemoci-rheumatické,-výživové,-žláz-s-vnitřním-vyměšováním,-jiné-nemoci-celkové-a-avitaminos" : { x: 1938, y: 585 },
  "nemoci-krve-a-ústrojů-krvetvorných" :  { x: 1938, y: 570 },
  "otravy-vleklé" :  { x: 1938, y: 555 },
  "nemoci-ústrojí-močového-a-pohlavního" :  { x: 1938, y: 540 },
  "nemoci-kůže-a-vaziva-podkožního" :  { x: 1938, y: 520 },
  "nemoci-kostí-a-ústrojí-pohybu" :  { x: 1938, y: 500 },
  "vrozené-vady-vývojové" :  { x: 1938, y: 480 },
  "zvláštní-nemoci-útlého-věku" :  { x: 1938, y: 460 },
  "vraždy-a-zabití" :  { x: 1938, y: 440 },
  "úrazy-při-dopravě" :  { x: 1938, y: 420 },
  "úrazy-a-otravy-mimo-dopravu" :  { x: 1938, y: 400 },
}