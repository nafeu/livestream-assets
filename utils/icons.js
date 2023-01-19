const { readdirSync, readFileSync } = require('fs');

const icons = {};

(function loadTemplateAssets() {
  try {
    readdirSync('icons').forEach(fileName => {
      const iconName = fileName.split('.')[0];

      icons[iconName] = readFileSync(`icons/${fileName}`).toString();
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();

module.exports = icons;
