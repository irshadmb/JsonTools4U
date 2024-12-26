// controllers/extractJsonKeys.js

const extractJsonKeys = (req, res) => {
    try {
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Missing required field',
                error: 'data object is required'
            });
        }

        // Extract all keys (including nested ones)
        const keys = getAllKeys(data);

        res.status(200).json({
            success: true,
            message: 'Keys extracted successfully',
            keys: {
                all: keys.all,
                topLevel: keys.topLevel,
                nested: keys.nested
            },
            originalData: data
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error extracting keys from JSON object',
            error: error.message
        });
    }
};

const getAllKeys = (obj, prefix = '', result = { all: new Set(), topLevel: new Set(), nested: new Set() }) => {
    for (const key in obj) {
        const value = obj[key];
        const fullPath = prefix ? `${prefix}.${key}` : key;

        // Add to appropriate sets
        if (!prefix) {
            result.topLevel.add(key);
        } else {
            result.nested.add(fullPath);
        }
        result.all.add(fullPath);

        // Recursively process nested objects
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            getAllKeys(value, fullPath, result);
        }
        // Handle arrays
        else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (item && typeof item === 'object') {
                    getAllKeys(item, `${fullPath}[${index}]`, result);
                }
            });
        }
    }
    
    // Convert Sets to Arrays before returning
    return {
        all: Array.from(result.all),
        topLevel: Array.from(result.topLevel),
        nested: Array.from(result.nested)
    };
};

module.exports = {
    extractJsonKeys
};