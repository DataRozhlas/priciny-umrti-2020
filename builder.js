const fs = require("fs");
const md = require("marked");
const yaml = require("node-yaml").parse;
const webpack = require("webpack");
const CleanCSS = require("clean-css");
const webpackConfig = require("./webpack.config");

const toWatch = ["./article.md", "./js", "./css"];

const libraryPresets = {
  jquery: "https://code.jquery.com/jquery-3.3.1.min.js",
  highcharts: "https://code.highcharts.com/highcharts.js",
  d3: "https://d3js.org/d3.v3.min.js",
};

function uvozovky(text) {
  let isTag = false;
  let uvozovkyCount = 0;
  let outText = "";
  const srcText = text.replace(/&quot;/g, "\"");
  [...srcText].forEach((letter) => {
    switch (letter) {
      case "„":
      case "“":
        uvozovkyCount += 1;
        outText += letter;
        break;
      case "\"":
        if (!isTag) {
          outText += uvozovkyCount % 2 ? "“" : "„";
          uvozovkyCount += 1;
        } else {
          outText += letter;
        }
        break;
      case "<":
      case ">":
        isTag = !isTag;
        outText += letter;
        break;
      default:
        outText += letter;
    }
  });
  return outText;
}

const build = async (mode) => {
  webpackConfig.mode = mode;
  const compiler = webpack(webpackConfig);

  // opening the source file
  const sourceParts = fs.readFileSync("./article.md", "utf8").split("---");
  const header = yaml(sourceParts[0]);
  let body = sourceParts[1];

  // setting up external libraries and styles set in the header
  let libLinks = "";
  let styleLinks = "";

  header.libraries.forEach((library) => {
    if (library === "datatables") {
      libLinks += "<script src=\"https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js\"></script>\n";
      libLinks += "<script src=\"https://cdn.datatables.net/responsive/2.2.3/js/dataTables.responsive.min.js\"></script>\n";
      styleLinks += "<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css\">\n";
      styleLinks += "<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css\">\n";
    } else if (library in libraryPresets) {
      libLinks += `<script src="${libraryPresets[library]}"></script>\n`;
    } else {
      libLinks += `<script src="${library}"></script>\n`;
    }
  });

  header.styles.forEach((style) => {
    styleLinks += `<link rel="stylesheet" type="text/css" href="${style}">`;
  });

  header.libraries = libLinks;
  header.styles = styleLinks;

  // compressing and inlining local CSS
  process.stdout.write("Balení stylů... ");
  let styleInput = "";
  fs.readdirSync("./css/").forEach((file) => {
    styleInput += fs.readFileSync(`./css/${file}`, "utf8");
  });
  header.styles += `<style>${new CleanCSS().minify(styleInput).styles}</style>`;

  // replacing pseudotags in the body
  body = body.replace(new RegExp("<wide>", "g"), "</div><div class=\"row-main row-main--article\">");
  body = body.replace(new RegExp("</wide>", "g"), "</div><div class=\"row-main row-main--narrow\">");

  body = body.replace(new RegExp("<left>", "g"), "<div class=\"b-inline b-inline--left\"><div class=\"b-inline__wrap\"><div class=\"b-inline__content\"><div class=\"text-sm\">");
  body = body.replace(new RegExp("</left>", "g"), "</div></div></div></div>");

  body = body.replace(new RegExp("<right>", "g"), "<div class=\"b-inline b-inline--right\"><div class=\"b-inline__wrap\"><div class=\"b-inline__content\"><div class=\"text-sm\">");
  body = body.replace(new RegExp("</right>", "g"), "</div></div></div></div>");

  // applying markdown to the body
  body = md(body);
  body = uvozovky(body);

  header.content = body;

  // reading the snowfall template
  let templateFile = "";

  if (header.options.includes("noheader")) {
    templateFile = "./templates/snowfall_noheader.html";
    if (header.options.includes("nopic")) {
      header.mainphoto = "";
    } else {
      header.mainphoto = `<figure class="b-detail__img"><img src="${header.coverimg}" width="100%" /><figcaption>${header.coverimg_note}</figcaption></figure>`;
    }
  } else {
    templateFile = "./templates/snowfall.html";
  }

  let template = fs.readFileSync(templateFile, "utf8");

  // the wide option
  if (header.options.includes("wide")) {
    header.column = "<div class=\"row-main row-main--article\">";
  } else {
    header.column = "<div class=\"row-main row-main--narrow\">";
  }

  // filling the template
  template.match(/{(.*?)}/g).forEach((variable) => {
    template = template.replace(variable, header[variable.substring(1, variable.length - 1)]);
  });

  // webpacking
  process.stdout.write("Balení skriptů... ");

  const promise = new Promise((resolve) => {
    compiler.run((err, stats) => {
      const message = (stats.compilation.errors.length > 0) ? `Chyba!\n${stats.compilation.errors}` : "Zabaleno...";
      process.stdout.write(message);
      resolve(fs.readFileSync("output.js", "utf8"));
    });
  });

  const packedScript = await promise;

  // injecting the JS and finishing up
  template = `${template}<script>${packedScript}</script>`;
  fs.writeFileSync("./output.html", template);

  // writing a dummy index
  let wrapper = fs.readFileSync("./templates/wrapper.html", "utf8");
  wrapper = wrapper.split("{content}").join(template);
  fs.writeFileSync("./index.html", wrapper);

  return "Hotovo!";
};

async function main() {
  if (process.argv[2] === "watch") {
    process.stdout.write("Sledování...\n");
    toWatch.forEach((name) => {
      let fsWait = false;
      fs.watch(name, async (event, filename) => {
        if (filename) {
          if (fsWait) return;
          fsWait = setTimeout(() => {
            fsWait = false;
          }, 1000);

          process.stdout.write(`Soubor ${filename} změnen.\nRebuildování... `);
          const built = await build("development");
          process.stdout.write(`\n${built} index.html je aktuální.\n`);
        }
      });
    });
  } else if (process.argv[2] === "build") {
    process.stdout.write("Buildování... ");
    const built = await build("production");
    process.stdout.write(`\n${built} Zkopírujte obsah output.html do redakčního systému.`);
  } else {
    process.stdout.write("Build spusťte přes npm run watch (sledování) / npm run build");
  }
}

main();
