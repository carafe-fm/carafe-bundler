# Carafe Bundler

This is a utility for working with Carafe Bundles outside of FileMaker. Carafe Bundler is an NPM package which is used for a number of different purposes.

1. It is packaged in an NPM Initializer to bootstrap a new Carafe Bundle project.
1. It is transpiled into a Browser Tool for rendering and validating Carafe Bundles in browser applications.
1. It can be packaged into any NPM project and used directly.

## Prerequisites

You will need to have [Node.js and NPM installed](https://nodejs.org/en/download/) to use this utility.

## NPM Initializer

Carafe Bundler has an initializer which you can use to bootstrap a new Carafe Bundle project. The initializer will bootstrap a new bundle project using a starter template and include Carafe Bundler as a devDependency.

This is for two important use cases:

1. Starting a brand new Bundle project in your preferred editor or IDE
1. Customizing or configuring any existing Bundle in your preferred editor or IDE

```bash
npm init @carafe-fm/bundle my-new-bundle
```

To work on an existing Bundle, you can initialize a new project with the appropriate project name, and then import the Bundle.

```bash
npm init @carafe-fm/bundle existing-bundle
cd existing-bundle
npm run import path/to/existing-bundle.json
```

The initializer includes a README in the new project which provides a npm run command reference.

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

You can install Carafe Bundler as a devDependency in your Node project and manipulate a bundle with any of the commandline tools.

```bash
npm install @carafe-fm/bundler --save-dev
``` 

### Validate A Carafe Bundle

```bash
validate-carafe-bundle -h
```

```bash
  usage: validate-carafe-bundle -b <path/to/existing/bundle.json>

  purpose: Validates a JSON Bundle.

  options:
    -b  <argument> Required path to existing valid JSON Bundle
    -h  Shows this help text
```

### Render A Bundle

```bash
render-carafe-bundle -h
```

```bash
  usage: render-carafe-bundle -b <path/to/existing/bundle.json> -o <path/to/output/rendered.html>

  purpose: Renders a validated JSON Bundle to a specified HTML output path.

  options:
    -b  <argument> Required path to existing valid JSON Bundle
    -o  <argument> Required path to output the rendered HTML
    -h  Shows this help text
```

### Extract A Bundle Into Source files

```bash
extract-carafe-bundle -h
```

```bash
  usage: extract-carafe-bundle -b  <path/to/existing/bundle.json>

  purpose: Extracts source files from a given valid JSON Bundle.
            CAUTION:  overwrites any existing files without warning.

  configuration: Source files are loaded from the current directory by default.
                 Source file paths may be customized in your package.json.
  options:
    -b  <argument> Required path to existing valid JSON Bundle
    -h  Shows this help text
```


### Start A Dev Server To Render Source Files And Watch For Changes

Starts watching four files in the current directory for changes and hot reloads the browser preview

```bash
render-carafe-source -h
```

```bash
  usage: render-carafe-source [-p <port>]

  purpose: Starts a dev server on localhost:8080 by default.
           Server hot reloads on changes to source files.

  configuration: Source files are loaded from the current directory by default.
                 Source file paths may be customized in your package.json.
  options:
    -p  <argument> Overrides the default localhost port (8080)
    -h  Shows this help text

```

Server defaults to `localhost:8080`

### Compile Source Files Into A Bundle And Optional Push to FileMaker

Compiles source files and outputs a Bundle to the specified path

```bash
compile-carafe-bundle -h
```

```bash
  usage: compile-carafe-bundle [-f] [-b <output/path/to/new/bundle.json>]

  purpose: Compiles source files to a validated JSON Bundle.
           Optionally sends Bundle to Carafe.fmp12 if it is open on the host system.

  configuration: Source files are loaded from the current directory by default.
                 Source file paths may be customized in your package.json.
  options:
    -f  Sends the compiled Bundle to Carafe.fmp12 if it is open on the host system
    -b  <argument> Overrides the default Bundle output path (dist/Carafe-Bundle-{name}-{version}.json)
    -h  Shows this help text

```