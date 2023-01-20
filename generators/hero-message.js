const Color = require('color');
const icons = require('../utils/icons');

const template = ({
  generatorOptions: {
    global: globalOptions,
    heroMessage
  },
  streamerInfo: {
    persona,
    follow: {
      text: followText
    }
  }
}) => {

const fontImportURL = heroMessage.fontImportURL || globalOptions.fontImportURL;
const fontFamily    = heroMessage.fontFamily || globalOptions.fontFamily;
const colors        = heroMessage.colors || globalOptions.colors;

const heading         = heroMessage.heading || persona;
const headingSize     = heroMessage.headingSize || '100px';
const subheading      = heroMessage.subheading || followText;
const subheadingSize  = heroMessage.subheadingSize || '25px';
const backgroundAlpha = heroMessage.backgroundAlpha || 1;

const backgroundColor = Color(colors.secondary).alpha(backgroundAlpha).hsl().string();

return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>livestream-assets | Hero Message</title>
  <style>
    @import url("${fontImportURL}");

    body {
      font-family: ${fontFamily};
      background-color: ${backgroundColor};
    }

    html, body {
      height: 100%;
      padding: 0;
      margin: 0;
    }

    * {
      box-sizing: border-box;
    }

    .container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .heading {
      font-size: ${headingSize};
      font-weight: 700;
      color: ${colors.primary};
    }

    .subheading {
      font-size: ${subheadingSize};
      font-weight: 100;
      color: ${colors.secondary};
      background-color: ${colors.primary};
      padding: 5px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="heading">${heading}</div>
    <div class="subheading">${subheading}</div>
  </div>
  <script type="text/javascript">
    function handleDomReady() {}

    function onDomReady(main) {
      document.addEventListener("DOMContentLoaded", main);
    }

    onDomReady(handleDomReady);
  </script>
</body>
</html>
`;
}

const buildHeroMessage = config => template(config);

module.exports = buildHeroMessage;
