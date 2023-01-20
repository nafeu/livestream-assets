const { writeFileSync, existsSync, mkdirSync } = require("fs");

const buildRotatingBadges = require('./generators/rotating-badges.js');
const buildHeroMessage    = require('./generators/hero-message.js');
const config              = require('./config.json');

const EXPORT_PATH = process.env.LIVESTREAM_ASSETS_EXPORT_PATH
  || config.EXPORT_PATH
  || 'exports';

const generatorOutputOptions = { encoding: 'utf8' };

(function createExportDirectory(){
  if (!existsSync('exports')){
    mkdirSync('exports');
  }
})();

function main() {
  try {
    const generators = [
      {
        name: 'rotating-badges',
        html: buildRotatingBadges(config)
      },
      {
        name: 'hero-message',
        html: buildHeroMessage(config)
      },
    ]

    generators.forEach(({ name, html }) => {
      writeFileSync(`${EXPORT_PATH}/${name}.html`, html, generatorOutputOptions);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
  console.log(`[ build-assets ] Assets built successfully. Check ${EXPORT_PATH} directory.`);
}

main();
