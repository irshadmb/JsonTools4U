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

        // Convert JSON to YAML
        const yamlResult = yaml.dump(jsonData, {
            indent: 2,
            noRefs: true,
            quotingType: '"'
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
            error: error.message,
            providedInput: jsonData
        });
    }
};

module.exports = {
    convertJsonToYaml
};