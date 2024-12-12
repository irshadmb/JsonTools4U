const { parse } = require('csv-parse/sync');

const convertCsvToJson = (req, res) => {
    const csvString = req.body;

    try {
        // Check if input is provided
        if (!csvString) {
            return res.status(400).json({
                success: false,
                message: 'No CSV content provided',
                error: 'Request body is empty'
            });
        }

        // Parse CSV with headers
        const jsonResult = parse(csvString, {
            columns: true, // Treat first row as headers
            skip_empty_lines: true,
            trim: true,
            cast: true // Automatically convert strings to native types
        });

        // Validate the result
        if (!Array.isArray(jsonResult) || jsonResult.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid CSV content or empty data',
                error: 'CSV parsing resulted in empty dataset'
            });
        }

        res.status(200).json({
            success: true,
            message: 'CSV successfully converted to JSON',
            data: jsonResult,
            originalCsv: csvString
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error converting CSV to JSON',
            error: error.message,
            providedInput: csvString
        });
    }
};

module.exports = {
    convertCsvToJson
};