// controllers/convertController.js
const yaml = require('js-yaml');

const convertYamlToJson = (req, res) => {
    const yamlString = req.body;

    try {
        // Check if input is provided
        if (!yamlString) {
            return res.status(400).json({
                success: false,
                message: 'No YAML content provided',
                error: 'Request body is empty'
            });
        }

        // Convert YAML to JSON
        const jsonResult = yaml.load(yamlString);

        // Validate the result
        if (jsonResult === undefined || jsonResult === null) {
            return res.status(400).json({
                success: false,
                message: 'Invalid YAML content',
                error: 'YAML parsing resulted in null or undefined'
            });
        }

        res.status(200).json({
            success: true,
            message: 'YAML successfully converted to JSON',
            data: jsonResult,
            originalYaml: yamlString
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error converting YAML to JSON',
            error: error.message,
            providedInput: yamlString
        });
    }
};

module.exports = {
    convertYamlToJson
};