# Livestream Assets

Generate web-based UI components for livestreaming (works with OBS).

> Available Assets

| Asset Type      | Options      | Preview      |
|-----------------|--------------|--------------|
| Rotating Badges | TODO: Update | TODO: Update |

## Installation

```
git clone https://github.com/nafeu/livestream-assets.git
cd livestream-assets
npm install
```

## Usage

Create a config file:

```
cp sample-config.json config.json
```

Update all of the info inside `config.json` and then run the build command to generate all of your assets:

```
npm run build
```

Open the `exports` folder and examine all of your exported assets.

### Using with OBS

All assets are exported as individual `.html` files which are compatible with OBS's *Browser Source* option. Just use the `Local file` option when creating a browser source and select an exported asset. Read [here](https://obsproject.com/kb/browser-source#:~:text=Browser%20source%20is%20one%20of,video%2C%20and%20even%20audio%20tasks.) for more info on the *browser-source* option.

## Development

Recommend using [nodemon](https://nodemon.io/) to keep the build script running and re-running on file-change.

```
nodemon index.js
```

Modify the templates and generators located in the `js` files in `generators/`.

## License

[MIT](https://choosealicense.com/licenses/mit/)
