const fs = require('fs');
const path = require('path');

class CarafeRenderer
{
    render(template, delimiter, config, data) {
        let result = template;

        Object.keys(config).forEach(name => {
            let value = '';

            if (! config[name].isData) {
                value = config[name].value;
            } else {
                value = data[name];
            }

            switch (typeof value) {
                case 'object':
                    value = JSON.stringify(value);

                default:
                    value = String(value);
            }

            const variableName = String(delimiter + name + delimiter).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
            result = result.replace(
                new RegExp(variableName, 'g'),
                value
            );
        });

        return result;
    }

    renderWatchedFiles(template, delimiter, watchedFiles) {
        let result = template;

        for (var fileName in watchedFiles) {
            let source = fs.readFileSync(watchedFiles[fileName], 'utf8');
            delete source.$schema;

            const variableName = String(delimiter + fileName + delimiter).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
            result = result.replace(
                new RegExp(variableName, 'g'),
                source
            );
        }

        return result;
    }

}

module.exports = CarafeRenderer;
