// Do budoucna budeme muset udělat ještě  mapu různých názvů napříč různými číselníky
export const colors = {
  // "default" : "#000",
  "visited" : "#AFB1A9",
  "default" : "#AFB1A9",
  "context" : "#E1E2DF",

  "nemoci-nakažlivé-a-cizopasné" : "#f95d6a",
  "rakovina-a-jiné-nádory" : "#a05195",
  "nemoci-rheumatické,-výživové,-žláz-s-vnitřním-vyměšováním,-jiné-nemoci-celkové-a-avitaminos" : "#000",
  "nemoci-krve-a-ústrojů-krvetvorných" : "#000",
  "otravy-vleklé" : "#000",
  "nemoci-soustavy-nervové-a-smyslových-ústrojů" : "#000",
  "nemoci-ústrojí-oběhu-krevního" : "#ffa600",
  "nemoci-ústrojů-dýchacích" : "#000",
  "nemoci-ústrojí-zažívacího" : "#000",
  "nemoci-ústrojí-močového-a-pohlavního" : "#000",
  "nemoci-kůže-a-vaziva-podkožního" : "#000",
  "nemoci-kostí-a-ústrojí-pohybu" : "#000",
  "vrozené-vady-vývojové" : "#000",
  "zvláštní-nemoci-útlého-věku" : "#000",
  "stařecká-sešlost" : "#000",
  "sebevraždy" : "#000",
  "vraždy-a-zabití" : "#000",
  "úrazy-při-dopravě" : "#000",
  "úrazy-a-otravy-mimo-dopravu" : "#000",
  "válečné-akce-a-soudní-poprava" : "#665191",
  "neurčité-příčiny-smrti" : "#000",
  
}

export const animationDuration = 100;

export const getCategoryColor = (category) => {
  return colors[category] ? colors[category] : colors["default"]
}

