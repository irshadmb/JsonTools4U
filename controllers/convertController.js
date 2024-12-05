// controllers/convertController.js

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

module.exports = {
    convertStringToJson
};