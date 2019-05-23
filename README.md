# Generátor obsahu pro snowfall šablonu iROZHLAS.cz - Node.js verze

> Já jsem šablona, co generuje střeva pro snowfall články. V téhle vylepšené verzi pro Node.js taky automaticky minifikuju skripty a proháním je přes Babel.

## Předpoklady
Je třeba [Node.js](https://nodejs.org/en/). Po naklonování builderu (viz níže) je nutno spusit příkaz `npm install` (nebo jen `npm i`), který nainstaluje vše potřebné.

## Nový článek

Jelikož si každý projekt nese dost "svého" bince, je vhodné pro každý článek založit separátní repozitář. K tomu slouží skript v Pythonu [smzd.py](https://github.com/DataRozhlas/deploy-tools). Stáhneme do pracovní složky `smzd.py` a `creds_sample.py`, do druhého jmenovaného vyplníme naše údaje z GitHubu a přejmenujeme na `creds.py`. Když pak spustíme `smzd.py`, můžeme si vybrat z nabízených možností:

- Nový projekt: vytvoří složku s naklonovaným builderem

```bash
smzd.py add nazev-projektu
```

- Nový projekt: vytvoří prázdnou složku

```bash
smzd.py addempty nazev-projektu
```

- Naklonování projektu z GitHubu

```bash
smzd.py clone nazev-projektu
```

## Psaní článku
Celý neinteraktivní obsah se nastavuje v souboru `article.md`. Skládá se ze dvou částí: hlavičky a obsahu.

### Hlavička
Hlavička je ukončena třemi spojovníky: `---`, uvnitř se používá YAML. Každá proměnná je na novém řádku, její název je to, co je před dvojtečkou a mezerou a obsah to, co je za ní. Textový obsah (pokud to není pole) se dává do uvozovek. Uvozovky v hlavičce je nejlepší řešit typografickými uvozovkami.

```yaml
title: "Nejrelativnější článek"
---
```

YAML umí i pole, to se používá u seznamu knihoven apod. To se píše jako ve většině programovacích jazyků

```yaml
libraries: [jquery, highcharts]
```

V hlavičce jsou tyto podporované proměnné. Pokud není napsáno jinak, jsou povinné.

- `title` Nadpis článku.
- `perex` Perex.
- `published` Datum vydání.
- `coverimg` Odkaz na webově dosažitelný uvodní velkoobrázek. Co největší, při prvním buildu se vygenerují potřebné zmenšeniny.
- `coverimg_note` Popisek k velkoobrázku (s možnou atribucí).
- `libraries` pole požadovaných externích knihoven. Knihovny, které se dají vložit jednoslovně: `jquery, d3, highcharts, datatables` (k DataTables se přidají i styly a responzivita). Jinak je nutné vložit celou URL na knihovnu.
- `styles` pole požadovaných externích stylů, píše se celá URL, např. `styles: [https://js.arcgis.com/3.17/esri/css/esri.css]`. Cíl musí být na https.
- **Vlastní JS skripty vkládejte do složky `js`, CSS styly do složky `styles`. Přikompilují se pak automaticky.**
- `options` pole pro různé přepínače. Možnosti: `wide` nastaví široký textový sloupec pro celý článek, `noheader` odstraní gigantickou hlavičku, `noheader, nopic` navíc umožní nemít otevírací obrázek vůbec.

Ostatní údaje se zadávají a přímo v redakčním systému.

### Obsah
Obsah se píše v [Markdownu](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet), je možné používat i běžné HTML. 

Různé interaktivity a obrázky se vkládají přes čisté HTML a s **absolutními cestami k souboru**. Soubory je třeba napřed dostat na server pomocí pushnutí na GitHub. Pokud máme v repozitáři třeba soubor `data.csv` ve složce `files`, po pushnutí ho najdeme na `dev.datarozhlas.cz/nazev-projektu/files/data.csv`. 

Můžete využívat také postranní boxíky - vkládají se přes pseudotagy `<left> </left>`, případně `<right> </right>`.

Pokud používáte defaultní úzký sloupec a chcete, aby byla nějaká vizualizace široká, stačí ji uzavřít do pseudotagů `<wide> </wide>`.

## Buildování
Když na článku pracujete, pomocí příkazu
```bash
npm run watch
```
zařídíte aktualizaci náhledového `index.html` pokaždé, když cokoliv upravíte. Není tedy třeba neustále buildovat.

Finální verzi článku (se zmenšenými skripty a styly) buildnete příkazem
```bash
npm run build
```

Build vytvoří `output.html`, jehož obsah následně vrazíte do hlavní položky ve snowfall šabloně. Také vytvoří náhledový `index.html` pro kontrolu. Pokud ho kopírujete a zobrazujete z jiné složky, je spolu s ním nutné zkopírovat i složky `fonts` a `wrapper_files`.

## Kontrola na serveru

Po pushnutí na GitHub článek najdete na adrese `data.irozhlas.cz/nazev-projektu`.
