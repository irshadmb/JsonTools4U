const yaml = require('js-yaml');

const convertJsonToYaml = (req, res) => {
    const jsonData = req.body;

    try {
        // Check if input is provided
        if (!jsonData) {
            return res.status(400).json({
                success: false,
                message: 'No JSON content provided',
                error: 'Request body is empty'
            });
        }

        // Validate input is actually JSON
        if (typeof jsonData !== 'object' || jsonData === null) {
            return res.status(400).json({
                success: false,
                message: 'Invalid JSON content provided',
                error: 'Request body must be valid JSON',
                receivedType: typeof jsonData
            });
        }

        // Convert JSON to YAML
        const yamlResult = yaml.dump(jsonData, {
            indent: 2,
            noRefs: true,
            quotingType: '"',
            lineWidth: 80,
            noCompatMode: true
        });

        res.status(200).json({
            success: true,
            message: 'JSON successfully converted to YAML',
            data: yamlResult,
            originalJson: jsonData
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error converting JSON to YAML',
            error: {
                type: error.name,
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            providedInput: jsonData
        });
    }
};

module.exports = {
    convertJsonToYaml
};