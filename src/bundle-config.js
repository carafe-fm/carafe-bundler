const fs = require('fs');

class BundleConfig
{
    constructor(workDir) {
        this.templateFilename = 'template.carafe';
        this.configFilename = 'config.json';
        this.dataFilename = 'data.json';
        this.metaFilename = 'meta.json';
        this.previewFilename = 'preview.jpg';
        this.pushFmpUrl = 'fmp://$/Carafe?script=Push%20Carafe%20Bundle&param={pushConfig}';
        this.watchedFiles = [];

        if (! fs.existsSync(workDir + '/' + 'package.json')) {
            return;
        }

        const packageConfig = JSON.parse(fs.readFileSync(workDir + '/' + 'package.json'));

        if (! packageConfig.carafe) {
            return;
        }

        if (packageConfig.carafe.templateFilename) {
            this.templateFilename = packageConfig.carafe.templateFilename;
        }

        if (packageConfig.carafe.configFilename) {
            this.configFilename = packageConfig.carafe.configFilename;
        }

        if (packageConfig.carafe.dataFilename) {
            this.dataFilename = packageConfig.carafe.dataFilename;
        }

        if (packageConfig.carafe.metaFilename) {
            this.metaFilename = packageConfig.carafe.metaFilename;
        }

        if (packageConfig.carafe.previewFilename) {
            this.previewFilename = packageConfig.carafe.previewFilename;
        }

        if (packageConfig.carafe.pushFmpUrl) {
            this.pushFmpUrl = packageConfig.carafe.pushFmpUrl;
        }

        if (packageConfig.carafe.watchedFiles) {
            this.watchedFiles = packageConfig.carafe.watchedFiles;
        }
    }
}

module.exports = BundleConfig;
