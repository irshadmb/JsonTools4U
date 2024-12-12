const mapJsonData = (req, res) => {
    const { sourceData, targetStructure, mappingRules } = req.body;

    try {
        // Validate request body
        if (!sourceData || !targetStructure || !mappingRules) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                error: 'sourceData, targetStructure, and mappingRules are required'
            });
        }

        // Perform the mapping
        const mappedData = performMapping(sourceData, targetStructure, mappingRules);

        res.status(200).json({
            success: true,
            message: 'JSON data mapped successfully',
            result: mappedData,
            original: {
                source: sourceData,
                target: targetStructure,
                mappingRules: mappingRules
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error mapping JSON data',
            error: error.message
        });
    }
};

// Update the performMapping function to pass sourceData to applyTransformation
const performMapping = (sourceData, targetStructure, mappingRules) => {
    let result = JSON.parse(JSON.stringify(targetStructure));

    mappingRules.forEach(rule => {
        const { sourcePath, targetPath, transform } = rule;

        try {
            let value = getValueByPath(sourceData, sourcePath);

            if (transform) {
                // Pass sourceData as third parameter
                value = applyTransformation(value, transform, sourceData);
            }

            setValueByPath(result, targetPath, value);
        } catch (error) {
            console.error(`Error processing mapping rule: ${JSON.stringify(rule)}`, error);
            throw new Error(`Mapping error for path ${sourcePath}: ${error.message}`);
        }
    });

    return result;
};

const getValueByPath = (obj, path) => {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
        if (current === null || current === undefined) {
            return undefined;
        }

        // Handle array indexing
        if (part.includes('[') && part.includes(']')) {
            const arrayName = part.split('[')[0];
            const index = parseInt(part.split('[')[1].split(']')[0]);
            current = current[arrayName]?.[index];
        } else {
            current = current[part];
        }
    }

    return current;
};

const setValueByPath = (obj, path, value) => {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;

        // Handle array indexing
        if (part.includes('[') && part.includes(']')) {
            const arrayName = part.split('[')[0];
            const index = parseInt(part.split('[')[1].split(']')[0]);

            if (!current[arrayName]) {
                current[arrayName] = [];
            }

            if (isLast) {
                current[arrayName][index] = value;
            } else {
                if (!current[arrayName][index]) {
                    current[arrayName][index] = {};
                }
                current = current[arrayName][index];
            }
        } else {
            if (isLast) {
                current[part] = value;
            } else {
                current[part] = current[part] || {};
                current = current[part];
            }
        }
    }
};

const applyTransformation = (value, transform, sourceData) => {
    switch (transform.type) {
        case 'uppercase':
            return String(value).toUpperCase();
        case 'lowercase':
            return String(value).toLowerCase();
        case 'number':
            return Number(value);
        case 'boolean':
            return Boolean(value);
        case 'string':
            return String(value);
        case 'date':
            return new Date(value).toISOString();
        case 'custom':
            if (transform.function) {
                // Pass both value and sourceData to the custom function
                return new Function('value', 'sourceData', transform.function)(value, sourceData);
            }
            throw new Error('Custom transform function not provided');
        default:
            throw new Error(`Unknown transform type: ${transform.type}`);
    }
};

module.exports = {
    mapJsonData
};