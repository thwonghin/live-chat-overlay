# Live Chat Overlay

Web Extension to overlay live chat on Youtube Livestreams.

Inspired by [Youtube Live Chat Flow](https://github.com/fiahfy/youtube-live-chat-flow)

## Install

Go to [Chrome Web Store](https://chrome.google.com/webstore/detail/live-chat-overlay/ahaklfidpffmhjhlkgakjgbkppdoaemo) to install with your browser (Google Chrome / Microsoft Edge).

## Screenshot

![Screenshot](screenshot.jpg)

## License

Read [LICENSE](LICENSE) file.

## Development

- You could use [`nvm`](https://github.com/nvm-sh/nvm) to make sure the node.js version is correct for this project. The node.js version is stated in [package.json](package.json)
- This project uses [`yarn`](https://github.com/yarnpkg/yarn) v2 as package manager with Plug'n'Play enabled and assumed you use VS Code as your IDE. You should install the recommended extensions for PnP to work on VS Code. If you want to support your IDE, please see [here](https://yarnpkg.com/getting-started/editor-sdks) and fire a pull request.
- Run `yarn start` to start webpack server in development environment. Then you can import '/dist' folder as extension.
- `*.scss.d.ts` will be generated when the webpack server is running, so we could import the `scss` files with type definitions.
- Run `yarn build:prod` to build in optimized settings.
- Run `yarn storybook` to start [storybook](https://storybook.js.org/).
- Please follow [Convertional Commit](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages. [Commitlint](https://github.com/conventional-changelog/commitlint) is used to check for incorrect format.
