const Color = require('color');
const icons = require('../utils/icons');
const { NON_BREAKING_WHITESPACE_HTML_ENTITY } = require('../utils/constants');

const template = ({
  config: {
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
  },
  carouselMessagesMarkup
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

    .carousel {
      color: ${colors.primary};
      font-size: 40px;
      font-weight: 100;
      margin: 10px;
      display: flex;
    }

    .text-wrapper {
      position: relative;
      display: inline-block;
      padding-top: 0.1em;
      padding-right: 0.05em;
      padding-bottom: 0.15em;
    }

    .line {
      opacity: 0;
      position: absolute;
      left: 0;
      height: 100%;
      width: 3px;
      background-color: #fff;
      transform-origin: 0 50%;
    }

    .line1 {
      top: 0;
      left: 0;
    }

    .letter {
      display: inline-block;
      line-height: 1em;
    }

    .letters {
      display: flex;
    }
  </style>

</head>
<body>
  <div class="container">
    <div class="heading">${heading}</div>
    <div class="subheading">${subheading}</div>
    <div class="carousel">
      <span class="text-wrapper">
        <span class="line line1"></span>
        <span id="carousel-letters" class="letters">
          <span class="letter">H</span>
          <span class="letter">e</span>
          <span class="letter">l</span>
          <span class="letter">l</span>
          <span class="letter">o</span>
          <span class="letter">&nbsp;</span>
          <span class="letter">W</span>
          <span class="letter">o</span>
          <span class="letter">r</span>
          <span class="letter">l</span>
          <span class="letter">d</span>
          <span class="letter">!</span>
        </span>
      </span>
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
  <script type="text/javascript">
    let carouselPosition = 0;

    const carouselMessages = ${carouselMessagesMarkup};

    function handleDomReady() {
      const carouselElement = document.getElementById('carousel-letters');

      carouselElement.innerHTML = carouselMessages[carouselPosition];

      const animateCarousel = () => {
        anime.timeline()
          .add({
            targets: '.letter',
            opacity: [0, 1],
            easing: "easeOutExpo",
            duration: 600,
            offset: '-=775',
            delay: (el, i) => 34 * (i+1),
            loop: true
          })
          .add({
            targets: '.carousel',
            opacity: [1, 0],
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000,
            changeComplete: function(anim) {
              carouselPosition = (carouselPosition + 1) % carouselMessages.length;

              carouselElement.innerHTML = carouselMessages[carouselPosition];

              animateCarousel();
            }
          });
      }

      animateCarousel();
    }

    function onDomReady(main) {
      document.addEventListener("DOMContentLoaded", main);
    }

    onDomReady(handleDomReady);
  </script>
</body>
</html>
`;
}

const getCarouselContentMarkup = ({
  generatorOptions: {
    heroMessage: { carouselMessages }
  }
}) => {
  const output = [];

  carouselMessages.forEach(carouselMessage => {
    const spanElements = carouselMessage.split('').map(character => (
      `<span class="letter">${character === ' ' ? NON_BREAKING_WHITESPACE_HTML_ENTITY : character}</span>`
    ))

    output.push(spanElements.join(''));
  });

  return JSON.stringify(output);
}

const buildHeroMessage = config => {
  const carouselMessagesMarkup = getCarouselContentMarkup(config);

  return template({ config, carouselMessagesMarkup });
}

module.exports = buildHeroMessage;
