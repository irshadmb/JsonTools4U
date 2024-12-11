// Add at the top with other requires
const xml2js = require('xml2js');


const convertXmlToJson = (req, res) => {
    const xmlString = req.body;
    const parser = new xml2js.Parser({ 
        explicitArray: false,
        trim: true,
        mergeAttrs: true
    });

    try {
        // Check if input is provided
        if (!xmlString) {
            return res.status(400).json({
                success: false,
                message: 'No XML content provided',
                error: 'Request body is empty'
            });
        }

        // Convert XML to JSON
        parser.parseString(xmlString, (error, jsonResult) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Error converting XML to JSON',
                    error: error.message,
                    providedInput: xmlString
                });
            }

            res.status(200).json({
                success: true,
                message: 'XML successfully converted to JSON',
                data: jsonResult,
                originalXml: xmlString
            });
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error processing XML content',
            error: error.message,
            providedInput: xmlString
        });
    }
};

// Add to exports
module.exports = {
    convertXmlToJson  
};