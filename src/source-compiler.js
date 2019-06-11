const fs = require('fs');
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

        const templateWithFiles = this.renderer.renderWatchedFiles(template, meta.bookend, this.bundleConfig.watchedFiles);

        const result = {
            '$schema': "https://carafe.fm/schema/draft-01/bundle.schema.json#",
            html: templateWithFiles,
            preview: preview,
            previewName: path.basename(this.bundleConfig.previewFilename),
            config: config,
            data: data,
        };

        return Object.assign(meta, result);
    }

    compileHtml() {
        const template = fs.readFileSync(this.bundleConfig.templateFilename, 'utf8');
        const config = JSON.parse(fs.readFileSync(this.bundleConfig.configFilename, 'utf8'));
        const data = JSON.parse(fs.readFileSync(this.bundleConfig.dataFilename, 'utf8'));
        const meta = JSON.parse(fs.readFileSync(this.bundleConfig.metaFilename, 'utf8'));
        const renderedTemplate = this.renderer.render(template, meta.bookend, config, data);
        return this.renderer.renderWatchedFiles(renderedTemplate, meta.bookend, this.bundleConfig.watchedFiles);
    }

    extract(bundle) {
        const meta = JSON.parse(JSON.stringify(bundle));

        fs.writeFileSync(this.bundleConfig.templateFilename, bundle.html);
        fs.writeFileSync(this.bundleConfig.previewFilename, Buffer.from(bundle.preview, 'base64'));
        fs.writeFileSync(this.bundleConfig.configFilename, JSON.stringify(bundle.config, null, 4));
        fs.writeFileSync(this.bundleConfig.dataFilename, JSON.stringify(bundle.data, null, 4));

        delete meta.html;
        delete meta.preview;
        delete meta.previewName;
        delete meta.config;
        delete meta.data;

        fs.writeFileSync(this.bundleConfig.metaFilename, JSON.stringify(meta, null, 4));
    }
}

module.exports = CarafeSourceCompiler;
