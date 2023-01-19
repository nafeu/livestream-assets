const { writeFileSync, existsSync, mkdirSync } = require("fs");

const buildRotatingBadges = require('./generators/rotating-badges.js');
const config              = require('./config.json');

const EXPORT_PATH = process.env.LIVESTREAM_ASSETS_EXPORT_PATH
  || config.EXPORT_PATH
  || 'exports';

(function createExportDirectory(){
  if (!existsSync('exports')){
    mkdirSync('exports');
  }
})();

function main() {
  try {
    writeFileSync(`${EXPORT_PATH}/rotating-badges.html`, buildRotatingBadges(config), { encoding: 'utf8' });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
  console.log(`[ build-assets ] Assets built successfully. Check ${EXPORT_PATH} directory.`);
}

main();
