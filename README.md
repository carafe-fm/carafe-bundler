# Carafe Bundler

This is a utility for managing Carafe Bundles outside of FileMaker. It has an NPM initializer for developing Carafe Bundles, a `dist` implementation for rendering and validating Carafe Bundles in browsers, and `bin` implementation for use in the CLI.

## Prerequisites

You will need to have [Node.js and NPM installed](https://nodejs.org/en/download/) to use this utility.

## NPM Initializer

This utility is used by the Carafe Bundle initializer, which you can use to initialize a new Carafe Bundle project. The initializer will install this utility, as well as bootstrap your new bundle project using a starter template.

```bash
npm init @soliantconsulting/carafe-bundle my-new-bundle-project
```
For many use cases, the initializer will be the preferred technique.

## Browser Tool

The `dist/carafe-bundler.js` tool is for validating and rendering bundles in web browser implementations. See `test/browser-bundler.html` for a working example.

### Validate

The `validator.validateBundle` method takes a json bundle argument, and returns a JavaScript Promise. Example usage:

```javascript
    var validator = new carafeBundler.default.CarafeValidator();
    validator.validateBundle(theJson)
        .then(function () {
            console.log('Bundle is valid.');
        })
        .catch(function (errors) {
            console.error('Bundle is not valid:');
            console.error(errors);
        });
```

### Render

The `renderer.render` method takes the html, bookend, config, and data bundle properties as arguments, and returns an HTML document. You can push it into an iframe with JavaScript like this:

```javascript
    var renderer = new carafeBundler.default.CarafeRenderer();
    var iframeDocument = document.querySelector('#theiframe').contentWindow.document;
    var content = renderer.render(theJson.html, theJson.bookend, theJson.config, theJson.data);
    iframeDocument.open('text/html', 'replace');
    iframeDocument.write(content);
    iframeDocument.close();
```



## CLI

You can manipulate a bundle with the provided JavaScript commandline tool

### Validate A Carafe Bundle

```bash
bin/validate-carafe-bundle.js \
    path/to/existing/bundle.json
```

### Render A Bundle

```bash
bin/render-carafe-bundle.js \
    path/to/bundle.json \
    path/to/output.html
```

### Extract A Bundle Into Source files

Outputs five files into the current directory
  * config.json
  * data.json
  * meta.json
  * preview.jpg
  * template.carafe

**WARNING** This will overwrite existing files

```bash
bin/extract-carafe-bundle.js \
    path/to/existing/bundle.json
```

### Start A Dev Server To Render Source Files And Watch For Changes

Starts watching four files in the current directory for changes and hot reloads the browser preview
  * config.json
  * data.json
  * meta.json
  * template.carafe

```bash
bin/render-carafe-source.js \
    {port}
```

Server defaults to `localhost:8080`

### Compile Source Files Into A Bundle

Compiles five files in the current directory and outputs a Bundle to the specified path
  * config.json
  * data.json
  * meta.json
  * preview.jpg
  * template.carafe

```bash
bin/create-carafe-bundle.js \
    output/path/to/new/bundle.json
```