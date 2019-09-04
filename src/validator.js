const Ajv = require('ajv');
const ajvErrors = require('ajv-errors');

const bundleSchema = require('../schema/bundle.schema');
const configSchema = require('../schema/config.schema');
const dataSchema = require('../schema/data.schema');
const metaSchema = require('../schema/meta.schema');

class CarafeValidator {
    constructor() {
        this.ajv = new Ajv({
            allErrors: true,
            jsonPointers: true,
            schemas: [
                bundleSchema,
                configSchema,
                dataSchema,
                metaSchema
            ],
        });
        ajvErrors(this.ajv);
    }

    validateBundle(bundle) {
        return this.validate('https://carafe.fm/schema/draft-02/bundle.schema.json', bundle);
    }

    validateConfig(config) {
        return this.validate('https://carafe.fm/schema/draft-02/config.schema.json', config);
    }

    validateData(data) {
        return this.validate('https://carafe.fm/schema/draft-02/data.schema.json', data);
    }

    validateMeta(meta) {
        return this.validate('https://carafe.fm/schema/draft-02/meta.schema.json', meta);
    }

    validate(schema, data) {
        return new Promise((resolve, reject) => {
            const validate = this.ajv.getSchema(schema);
            const valid = validate(data);

            if (valid) {
                resolve();
                return;
            }

            reject(validate.errors);
        });
    }
}

module.exports = CarafeValidator;
