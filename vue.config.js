let EvIcon = require('evwt/background/EvIcon');
let MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin(
        {
          languages: ['markdown'],
          features: [
            '!accessibilityHelp',
            '!bracketMatching',
            '!caretOperations',
            '!clipboard',
            '!codeAction',
            '!codelens',
            '!colorDetector',
            '!comment',
            '!contextmenu',
            '!coreCommands',
            '!cursorUndo',
            '!dnd',
            '!find',
            '!folding',
            '!fontZoom',
            '!format',
            '!gotoError',
            '!gotoLine',
            '!gotoSymbol',
            '!hover',
            '!iPadShowKeyboard',
            '!inPlaceReplace',
            '!inspectTokens',
            '!linesOperations',
            '!links',
            '!multicursor',
            '!parameterHints',
            '!quickCommand',
            '!quickOutline',
            '!referenceSearch',
            '!rename',
            '!smartSelect',
            '!snippets',
            '!suggest',
            '!toggleHighContrast',
            '!toggleTabFocusMode',
            '!transpose',
            '!wordHighlighter',
            '!wordOperations',
            '!wordPartOperations'
          ]
        }
      )
    ]
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        fileAssociations: [
          {
            ext: 'md',
            role: 'Editor'
          }
        ]
      },
      nodeIntegration: true,
      chainWebpackRendererProcess: (config) => {
        EvIcon.use(config);
      }
    }
  }
};
