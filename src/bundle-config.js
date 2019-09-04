const fs = require('fs');

class BundleConfig {
    constructor(workDir) {
        this.templateFilename = 'src/template.carafe';
        this.configFilename = 'src/config.json';
        this.dataFilename = 'src/data.json';
        this.metaFilename = 'src/meta.json';
        this.previewFilename = 'src/preview.jpg';
        this.librariesDirname = 'src/libraries';
        this.sendFmpUrl = 'fmp://$/Carafe?script=Send%20Carafe%20Bundle&param={sendConfig}';
        this.watchedFiles = {};

        if (!fs.existsSync(workDir + '/' + 'package.json')) {
            return;
        }

        const packageConfig = JSON.parse(fs.readFileSync(workDir + '/' + 'package.json'));

        if (!packageConfig.carafe) {
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

        if (packageConfig.carafe.librariesDirname) {
            this.librariesDirname = packageConfig.carafe.librariesDirname;
        }

        if (packageConfig.carafe.sendFmpUrl) {
            this.sendFmpUrl = packageConfig.carafe.sendFmpUrl;
        }

        if (packageConfig.carafe.watchedFiles) {
            this.watchedFiles = packageConfig.carafe.watchedFiles;
        }
    }
}

module.exports = BundleConfig;
