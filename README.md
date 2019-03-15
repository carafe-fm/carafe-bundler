# Carafe Bundler

This is a proof of concept that demonstrates the basic solution of rendering a Carafe Bundle outside of FileMaker. 

You can convert a bundle to output html with the provided JavaScript commandline tool

```bash
bin/render-carafe-bundle.js path/to/bundle.json path/to/output.html
```

Example:

```bash
bin/render-carafe-bundle.js test/sample-widget.json test.html
```

## Roadmap

* Support for rendering from separate html, config, meta, and data source files
* Support for compiling and decompiling a Carafe Bundle
* Realtime re-rendering when sources change
* Initialization of a new empty Carafe Bundle project
* Initialization of a new Carafe Bundle project from an existing Carafe Bundle
* NPM packaging to support `npm install`
* JsonSchema Carafe Bundle Validator