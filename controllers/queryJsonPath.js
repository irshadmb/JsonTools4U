const jsonpath = require('jsonpath');

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
    queryJsonPath
}
