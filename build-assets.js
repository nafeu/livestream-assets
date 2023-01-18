const { readFileSync, writeFileSync, readdirSync } = require("fs");

let config;
let summary;

const icons = {};

(function loadTemplateConfigs() {
  try {
    config  = JSON.parse(readFileSync('config.json').toString());
    summary = readFileSync('templates/summary.txt').toString();

    readdirSync('icons').forEach(fileName => {
      const iconName = fileName.split('.')[0];

      icons[iconName] = readFileSync(`icons/${fileName}`).toString();
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

const getCallToActionDisplay = callsToAction => {
  const elements = [];

  callsToAction.forEach((text, index) => {
    const markup = `
      <div id="cta-${index}" class="call-to-action">
        ${text}
      </div>
    `;

    elements.push(markup);
  });

  return elements.join('');
}

const getLinksMarkup = links => {
  const elements = [];

  links.forEach(({ icon, text, callsToAction }) => {
    const markup = `
      <div class="badge">
        ${icons[icon]} ${text} ${config.delimiter} ${getCallToActionDisplay(callsToAction)}
      </div>
    `;

    elements.push(markup);
  });

  return elements.join('');
}

const buildSummary = () => {
  summary = summary
    .replace(/\[FONT_IMPORT_URL\]/gi, config.fontImportURL)
    .replace(/\[FONT_FAMILY\]/gi, config.fontFamily)
    .replace(/\[FONT_SIZE\]/gi, config.fontSize)
    .replace(/\[FONT_WEIGHT\]/gi, config.fontWeight)
    .replace(/\[FONT_STYLE\]/gi, config.fontStyle)
    .replace(/\[COLOR_PRIMARY\]/gi, config.colors.primary)
    .replace(/\[COLOR_SECONDARY\]/gi, config.colors.secondary)
    .replace(/\[LINKS\]/gi, getLinksMarkup(config.links))

  try {
    writeFileSync('index.html', summary, { encoding: 'utf8' });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }

  console.log('[ build-assets ] Assets built successfully.');
}

function main() {
  buildSummary();
}

main();
