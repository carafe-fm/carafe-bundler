# Examples

This directory contains an example `examples/src` directory containing bundle project files.

## Working with the example bundle project

Open a terminal and cd into examples. From there, you can run the five CLI scripts directly, using all the documented switches and args.

For example, this command will compile the src project into a bundle and send it to Carafe.fmp12

```
../bin/compile-carafe-bundle.js -s
```

For complete documentation of the CLI see the main README.md in the project root.

## Browser Use Cases

Examples also contains several useful html implementations

### Browser Bundler

examples/browser-bundler.html

Illustrates usage of the bundler package in an html document, for use cases such as validating and previewing on Carafe.FM.


### FileMaker Webviewer About

examples/fm-webviewer-about.html

Illustrates enumerating the references array from a bundle.


### FileMaker Webviewer Validator

examples/fm-webviewer-validator.html

Illustrates usage of the bundler self contained in an html document, for use cases such as validating a bundle from within FileMaker

This file can be chuncked using split with 25000 byte chunks to fit into the Carafe.fmp12 script *Validate Bundle*

```
split -b 25000 fm-webviewer-validator.html htmlChunk
```

## Bundle Generated From FileMaker

examples/hello-world-2-1-0-jeremiah-small.carafe-draft-02.json

Illustrates a the bundle included in examples/src when exported from Carafe.fmp12
