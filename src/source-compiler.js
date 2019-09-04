const fs = require('fs-extra');
const path = require('path');

class CarafeSourceCompiler {
    constructor(bundleConfig, renderer) {
        this.bundleConfig = bundleConfig;
        this.renderer = renderer;
    }

    compileBundle() {
        const template = fs.readFileSync(this.bundleConfig.templateFilename, 'utf8');
        let config = JSON.parse(fs.readFileSync(this.bundleConfig.configFilename, 'utf8'));
        delete config.$schema;
        let data = JSON.parse(fs.readFileSync(this.bundleConfig.dataFilename, 'utf8'));
        delete data.$schema;
        let meta = JSON.parse(fs.readFileSync(this.bundleConfig.metaFilename, 'utf8'));
        delete meta.$schema;
        const preview = fs.readFileSync(this.bundleConfig.previewFilename).toString('base64');

        const libraries = this.compileLibraries(config);

        const templateWithFiles = this.renderer.renderWatchedFiles(template, meta.bookend, this.bundleConfig.watchedFiles);

        const result = {
            '$schema': "https://carafe.fm/schema/draft-02/bundle.schema.json#",
            template: templateWithFiles,
            preview: preview,
            previewType: path.extname(this.bundleConfig.previewFilename).substring(1),
            config: config,
            data: data,
            libraries: libraries
        };

        return Object.assign(meta, result);
    }

    compileLibraries(config) {
        let libraries = {};
        Object.keys(config).forEach(name => {
            let path = '';
            if (config[name].source === 'libraries') {
                path = config[name].path;
                libraries[name] = fs.readFileSync(this.bundleConfig.librariesDirname + path, 'utf8')
            }
        });
        return libraries;
    }

    compileHtml() {
        const template = fs.readFileSync(this.bundleConfig.templateFilename, 'utf8');
        const config = JSON.parse(fs.readFileSync(this.bundleConfig.configFilename, 'utf8'));
        const data = JSON.parse(fs.readFileSync(this.bundleConfig.dataFilename, 'utf8'));
        const meta = JSON.parse(fs.readFileSync(this.bundleConfig.metaFilename, 'utf8'));
        const libraries = this.compileLibraries(config);
        const renderedTemplate = this.renderer.render(template, meta.bookend, config, data, libraries);
        return this.renderer.renderWatchedFiles(renderedTemplate, meta.bookend, this.bundleConfig.watchedFiles);
    }

    extract(bundle) {
        const meta = JSON.parse(JSON.stringify(bundle));

        fs.outputFileSync(this.bundleConfig.templateFilename, bundle.template);
        fs.outputFileSync(this.bundleConfig.previewFilename, Buffer.from(bundle.preview, 'base64'));
        fs.outputFileSync(this.bundleConfig.configFilename, JSON.stringify(bundle.config, null, 4));
        fs.outputFileSync(this.bundleConfig.dataFilename, JSON.stringify(bundle.data, null, 4));
        Object.keys(bundle.config).forEach(name => {
            let path = '';
            if (bundle.config[name].source === 'libraries') {
                path = bundle.config[name].path;
                fs.outputFileSync(this.bundleConfig.librariesDirname + path, bundle.libraries[name]);
            }
        });

        delete meta.template;
        delete meta.preview;
        delete meta.config;
        delete meta.data;
        delete meta.libraries;

        fs.writeFileSync(this.bundleConfig.metaFilename, JSON.stringify(meta, null, 4));
    }
}

module.exports = CarafeSourceCompiler;
