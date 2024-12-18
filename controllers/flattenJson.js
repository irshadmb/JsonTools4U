const flattenJson = (req, res) => {
    try {
        const { data, delimiter = '.' } = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Missing required field',
                error: 'data object is required'
            });
        }

        const result = flatten(data, delimiter);

        res.status(200).json({
            success: true,
            message: 'JSON object flattened successfully',
            result,
            original: data
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error flattening JSON object',
            error: error.message
        });
    }
};

const flatten = (obj, delimiter = '.', prefix = '', result = {}) => {
    for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}${delimiter}${key}` : key;

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            // Recursively flatten nested objects
            flatten(value, delimiter, newKey, result);
        } else if (Array.isArray(value)) {
            // Handle arrays by including index in the key
            value.forEach((item, index) => {
                if (item && typeof item === 'object') {
                    flatten(item, delimiter, `${newKey}[${index}]`, result);
                } else {
                    result[`${newKey}[${index}]`] = item;
                }
            });
        } else {
            // Add leaf nodes to result
            result[newKey] = value;
        }
    }
    return result;
};

module.exports = {
    flattenJson
};