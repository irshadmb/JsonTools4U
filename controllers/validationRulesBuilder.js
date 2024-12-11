const buildValidationRule = (req, res) => {
    const { fieldName, ruleType, parameters } = req.body;

    try {
        // Validate request body
        if (!fieldName || !ruleType) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                error: 'fieldName and ruleType are required'
            });
        }

        // Generate validation rule based on type
        const rule = generateRule(fieldName, ruleType, parameters);

        res.status(200).json({
            success: true,
            message: 'Validation rule generated successfully',
            rule: rule
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error generating validation rule',
            error: error.message
        });
    }
};

const generateRule = (fieldName, ruleType, parameters = {}) => {
    const baseRule = {
        field: fieldName,
        type: ruleType,
        required: parameters.required || false
    };

    switch (ruleType) {
        case 'string':
            return {
                ...baseRule,
                minLength: parameters.minLength,
                maxLength: parameters.maxLength,
                pattern: parameters.pattern,
                format: parameters.format // email, date, uri, etc.
            };

        case 'number':
            return {
                ...baseRule,
                minimum: parameters.minimum,
                maximum: parameters.maximum,
                multipleOf: parameters.multipleOf,
                isInteger: parameters.isInteger || false
            };

        case 'array':
            return {
                ...baseRule,
                minItems: parameters.minItems,
                maxItems: parameters.maxItems,
                uniqueItems: parameters.uniqueItems || false,
                items: parameters.items // Validation rules for array items
            };

        case 'object':
            return {
                ...baseRule,
                properties: parameters.properties, // Nested validation rules
                additionalProperties: parameters.additionalProperties
            };

        case 'boolean':
            return baseRule;

        case 'enum':
            return {
                ...baseRule,
                values: parameters.values || []
            };

        case 'custom':
            return {
                ...baseRule,
                validation: parameters.validation,
                errorMessage: parameters.errorMessage
            };

        default:
            throw new Error(`Unsupported rule type: ${ruleType}`);
    }
};

const validateWithRules = (req, res) => {
    const { data, rules } = req.body;

    try {
        const validationResults = validateData(data, rules);

        res.status(200).json({
            success: true,
            message: validationResults.valid ? 'Validation passed' : 'Validation failed',
            results: validationResults
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error during validation',
            error: error.message
        });
    }
};

const validateData = (data, rules) => {
    const results = {
        valid: true,
        errors: []
    };

    rules.forEach(rule => {
        const value = data[rule.field];
        const fieldErrors = validateField(value, rule);
        
        if (fieldErrors.length > 0) {
            results.valid = false;
            results.errors.push(...fieldErrors.map(error => ({
                field: rule.field,
                error: error
            })));
        }
    });

    return results;
};

const validateField = (value, rule) => {
    const errors = [];

    // Required check
    if (rule.required && (value === undefined || value === null)) {
        errors.push('Field is required');
        return errors;
    }

    // Skip further validation if value is not provided and not required
    if (value === undefined || value === null) {
        return errors;
    }

    switch (rule.type) {
        case 'string':
            if (typeof value !== 'string') {
                errors.push('Value must be a string');
            } else {
                if (rule.minLength && value.length < rule.minLength) {
                    errors.push(`Minimum length is ${rule.minLength}`);
                }
                if (rule.maxLength && value.length > rule.maxLength) {
                    errors.push(`Maximum length is ${rule.maxLength}`);
                }
                if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
                    errors.push('Value does not match required pattern');
                }
                if (rule.format) {
                    validateFormat(value, rule.format, errors);
                }
            }
            break;

        case 'number':
            if (typeof value !== 'number') {
                errors.push('Value must be a number');
            } else {
                if (rule.minimum !== undefined && value < rule.minimum) {
                    errors.push(`Value must be greater than or equal to ${rule.minimum}`);
                }
                if (rule.maximum !== undefined && value > rule.maximum) {
                    errors.push(`Value must be less than or equal to ${rule.maximum}`);
                }
                if (rule.multipleOf && value % rule.multipleOf !== 0) {
                    errors.push(`Value must be a multiple of ${rule.multipleOf}`);
                }
                if (rule.isInteger && !Number.isInteger(value)) {
                    errors.push('Value must be an integer');
                }
            }
            break;

        // Add more validation types as needed
    }

    return errors;
};

const validateFormat = (value, format, errors) => {
    switch (format) {
        case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errors.push('Invalid email format');
            }
            break;
        case 'date':
            if (isNaN(Date.parse(value))) {
                errors.push('Invalid date format');
            }
            break;
        case 'uri':
            try {
                new URL(value);
            } catch {
                errors.push('Invalid URI format');
            }
            break;
    }
};

module.exports = {
    buildValidationRule,
    validateWithRules
};