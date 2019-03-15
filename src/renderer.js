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
}

module.exports = CarafeRenderer;
