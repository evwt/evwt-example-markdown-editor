# evwt-example-markdown-editor  [![Build Status](https://travis-ci.org/evwt/evwt-example-markdown-editor.svg?branch=master)](https://travis-ci.org/evwt/evwt-example-markdown-editor)

An example EVWT app to edit markdown files with a live preview. 

This app also serves as the official [testbed](https://github.com/evwt/evwt-example-markdown-editor/tree/master/test) of EVWT.

---

![markdown-demo](https://user-images.githubusercontent.com/611996/89716173-77eff300-d970-11ea-8119-e736a6b5671a.png)

This project was created with:

```
npm install -g @vue/cli
vue create evwt-example-markdown-editor
cd evwt-example-markdown-editor
vue add electron-builder
npm install evwt
```

Tests were added with these commands:

```
npm i spectron mocha -D
mkdir test
touch test/spec.js
```

Then this was added to package.json:

```
"scripts": {
  "test": "mocha"
}
```

Run tests with:

`npm run test`


