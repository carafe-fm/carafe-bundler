class CarafeRenderer
{
    render(template, delimiter, config, data) {
        let result = template;

        Object.keys(config).forEach(name => {
            let value = '';

            if (! config[name].isData) {
                value = String(config[name].value);
            } else {
                value = String(data[name]);
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
