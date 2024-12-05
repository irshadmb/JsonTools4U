// controllers/convertController.js
const jsonpath = require('jsonpath');

const convertStringToJson = (req, res) => {
    const requestBody = req.body;

    try {
        // Directly parse the JSON string if it is valid
        const jsonResult = JSON.parse(JSON.parse(requestBody));

        console.log(jsonResult);
       
        // Respond with the parsed JSON
        res.status(200).json({
            success: true,
            message: 'String successfully converted to JSON',
            data: jsonResult,
        });
    } catch (error) {
        // If parsing fails, handle gracefully
        res.status(400).json({
            success: false,
            message: 'Invalid JSON string provided',
            error: error.message,
        });
    }
};

const validateJson = (req, res) => {
    let requestBody = req.body;

    try {
        // If requestBody is already a JSON object, convert it to string for validation
        if (typeof requestBody === 'object') {
            requestBody = JSON.stringify(requestBody);
        }

        // Try to parse the JSON
        let jsonData;
        try {
            jsonData = typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody;
        } catch (parseError) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON format',
                error: parseError.message,
                providedInput: requestBody
            });
        }

        console.log('Parsed JSON Data:', jsonData);

        // Validate JSON structure
        const validation = {
            isValid: true,
            issues: []
        };

        // Enhanced recursive validation function
        const validateData = (data, path = '') => {
            // Check for null or undefined
            if (data === null) {
                validation.issues.push(`Null value found at '${path}'`);
                return false;
            }

            if (typeof data === 'undefined') {
                validation.issues.push(`Undefined value found at '${path}'`);
                return false;
            }

            // Handle arrays
            if (Array.isArray(data)) {
                if (data.length === 0) {
                    validation.issues.push(`Empty array found at '${path}'`);
                }

                // Validate each item in the array
                data.forEach((item, index) => {
                    const currentPath = path ? `${path}[${index}]` : `[${index}]`;
                    validateData(item, currentPath);
                });

                return true;
            }

            // Handle objects
            if (typeof data === 'object') {
                // Check for empty objects
                if (Object.keys(data).length === 0) {
                    validation.issues.push(`Empty object found at '${path}'`);
                }

                // Recursively validate object properties
                Object.entries(data).forEach(([key, value]) => {
                    const currentPath = path ? `${path}.${key}` : key;
                    validateData(value, currentPath);
                });

                return true;
            }

            return true;
        };

        // Start validation
        validateData(jsonData);

        // Set isValid based on whether there are any issues
        if (validation.issues.length > 0) {
            validation.isValid = false;
        }

        res.status(200).json({
            success: validation.isValid,
            message: validation.isValid ? 'JSON is valid' : 'JSON has potential issues',
            validation: {
                isValid: validation.isValid,
                issues: validation.issues
            },
            data: jsonData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during validation',
            error: error.message
        });
    }
};

const queryJsonPath = (req, res) => {
    const jsonData = req.body;
    const jsonPathQuery = req.query.path;

    if (!jsonPathQuery) {
        return res.status(400).json({
            success: false,
            message: 'JSONPath query is required as a query parameter',
            error: 'Missing "path" query parameter'
        });
    }

    try {
        // Validate if input is valid JSON
        if (typeof jsonData !== 'object' || jsonData === null) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON input',
                error: 'Request body must be a valid JSON object'
            });
        }

        // Execute JSONPath query
        const result = jsonpath.query(jsonData, jsonPathQuery);

        res.status(200).json({
            success: true,
            message: 'JSONPath query executed successfully',
            query: jsonPathQuery,
            result: result,
            originalData: jsonData
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error executing JSONPath query',
            error: error.message,
            query: jsonPathQuery
        });
    }
};

module.exports = {
    convertStringToJson,
    validateJson,
    queryJsonPath,
};