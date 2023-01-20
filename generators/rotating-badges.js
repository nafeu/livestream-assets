const icons = require('../utils/icons');

const template = ({
  config: {
    generatorOptions: {
      global: globalOptions,
      rotatingBadges
    }
  },
  badgeMarkup,
  badgeCount
}) => {

const fontImportURL = globalOptions.fontImportURL || rotatingBadges.fontImportURL;
const fontFamily    = globalOptions.fontFamily || rotatingBadges.fontFamily;

return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>livestream-assets | Rotating Badges</title>
  <style>
    @import url("${fontImportURL}");

    body {
      font-family: ${fontFamily};
    }

    svg {
      width: 24px;
      height: 24px;
    }

    .badge {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 40px;
      position: absolute;
      transition: 300ms ease-in-out all;
      top: -200px;
    }

    .badge-username {
      color: black;
      background-color: white;
      fill: black;
      border: 3px solid black;
      font-weight: bold;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;
      padding: 10px 10px;
      margin: 5px;
      border-radius: 5px;
      transition: 300ms ease-in-out all;
    }

    .badge-call-to-action {
      color: white;
      background-color: black;
      font-size: 0.75em;
      font-weight: 400;
      padding: 5px 15px;
      margin: 5px;
      border-radius: 5px;
      transition: 300ms ease-in-out all;
    }

    .active {
      top: 10px;
    }
  </style>
</head>
<body>
  ${badgeMarkup}
  <script type="text/javascript">
    let currentBadgePosition = 0;
    const BADGE_COUNT = ${badgeCount}
    const COLORS = ${JSON.stringify(rotatingBadges.badgeColors)}

    function getRandomItemFromArray(array) {
      return array[Math.floor(Math.random()*array.length)];
    }

    function rotateBadges() {
      const interval = setInterval(() => {
        (function assignBadgeIds(){
          const badgeElements = document.querySelectorAll(".badge");

          badgeElements.forEach((badgeElement, index) => {
            badgeElement.id = \`badge-\$\{index\}\`;
          })
        })();

        (function hideAllBadges(){
          const badgeElements = document.querySelectorAll(".badge");

          badgeElements.forEach(badgeElement => {
            badgeElement.classList.remove('active');
          })
        })();

        (function showCurrentBadge(){
          const badgeElement = document.getElementById(\`badge-\$\{currentBadgePosition\}\`);
          const badgeUsernameElement = badgeElement.querySelector('.badge-username');
          const badgeCallToActionElement = badgeElement.querySelector('.badge-call-to-action');

          const { primary, secondary } = getRandomItemFromArray(COLORS);

          badgeUsernameElement.style.color = primary;
          badgeUsernameElement.style.backgroundColor = secondary;
          badgeUsernameElement.style.border = \`3px solid \$\{primary\}\`;
          badgeUsernameElement.style.fill = primary;

          badgeCallToActionElement.style.color = secondary;
          badgeCallToActionElement.style.backgroundColor = primary;

          badgeElement.classList.add('active');

          currentBadgePosition = (currentBadgePosition + 1) % BADGE_COUNT;
        })();

      }, ${rotatingBadges.rotationTimeMs});
    }

    function handleDomReady() {
      ${rotatingBadges.rotate ? 'rotateBadges();' : ''}
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

const getBadgeMarkupByLinks = links => {
  const elements = [];

  links.forEach(({ icon, text, ctas }, linkIndex) => {
    ctas.forEach((cta, ctasIndex) => {
      const isFirstItem = (linkIndex + ctasIndex) === 0;

      const markup = `
        <div class="badge ${isFirstItem && 'active'}" >
          <div class="badge-username">
            ${icons[icon]} ${text}
          </div>
          <div class="badge-call-to-action">
            ${cta}
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

  links.forEach(({ ctas }) => {
    ctas.forEach(() => {
      count += 1;
    })
  })

  return count;
}

const buildRotatingBadges = config => {
  const badgeMarkup = getBadgeMarkupByLinks(config.streamerInfo.links);
  const badgeCount  = getBadgeCount(config.streamerInfo.links);

  return template({ config, badgeMarkup, badgeCount });
}

module.exports = buildRotatingBadges;
