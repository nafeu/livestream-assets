const {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync
} = require("fs");

let config;
let rotatingBadges;

const icons = {};

(function createExportDirectory(){
  if (!existsSync('exports')){
    mkdirSync('exports');
  }
})();

(function loadTemplateConfigs() {
  try {
    config         = JSON.parse(readFileSync('config.json').toString());
    rotatingBadges = readFileSync('templates/rotating-badges.txt').toString();

    readdirSync('icons').forEach(fileName => {
      const iconName = fileName.split('.')[0];

      icons[iconName] = readFileSync(`icons/${fileName}`).toString();
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

const getLinksMarkup = links => {
  const elements = [];

  links.forEach(({ icon, text, callsToAction }, linkIndex) => {
    callsToAction.forEach((callToAction, callsToActionIndex) => {
      const isFirstItem = (linkIndex + callsToActionIndex) === 0;

      const markup = `
        <div class="badge ${isFirstItem && 'active'}" >
          <div class="badge-username">
            ${icons[icon]} ${text}
          </div>
          <div class="badge-call-to-action">
            ${callToAction}
          </div>
        </div>
      `;

      elements.push(markup);
    })
  });

  return elements.join('');
}

const getBadgeCount = links => {
  let count = 0;

  links.forEach(({ callsToAction }) => {
    callsToAction.forEach(() => {
      count += 1;
    })
  })

  return count;
}

const buildRotatingBadges = () => {
  rotatingBadges = rotatingBadges
    .replace(/\[FONT_IMPORT_URL\]/gi, config.fontImportURL)
    .replace(/\[COLORS\]/gi, JSON.stringify(config.colors))
    .replace(/\[FONT_FAMILY\]/gi, config.fontFamily)
    .replace(/\[LINKS\]/gi, getLinksMarkup(config.links))
    .replace(/\[BADGE_COUNT\]/gi, getBadgeCount(config.links))
    .replace(/\[ROTATION_TIME_MS\]/gi, config.rotationTimeMs)

  if (config.rotateBadges) {
    rotatingBadges = rotatingBadges.replace(/\[ROTATE_BADGES\]/gi, 'rotateBadges();')
  }

  try {
    writeFileSync('exports/rotating-badges.html', rotatingBadges, { encoding: 'utf8' });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }

  console.log('[ build-assets ] Assets built successfully.');
}

function main() {
  buildRotatingBadges();
}

main();
