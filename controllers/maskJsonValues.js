// controllers/maskJsonValues.js

const maskJsonValues = (req, res) => {
    try {
        const { data, maskingRules } = req.body;

        if (!data || !maskingRules) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                error: 'data and maskingRules are required'
            });
        }

        // Create a deep copy of the original data
        const maskedData = JSON.parse(JSON.stringify(data));
        
        // Apply masking rules
        applyMaskingRules(maskedData, maskingRules);

        res.status(200).json({
            success: true,
            message: 'JSON values masked successfully',
            result: maskedData,
            originalData: data
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error masking JSON values',
            error: error.message
        });
    }
};

const applyMaskingRules = (data, rules) => {
    for (const rule of rules) {
        const { path, maskType, options = {} } = rule;
        const value = getValueByPath(data, path);
        
        if (value !== undefined) {
            const maskedValue = maskValue(value, maskType, options);
            setValueByPath(data, path, maskedValue);
        }
    }
};

const getValueByPath = (obj, path) => {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
        if (current === null || current === undefined) {
            return undefined;
        }
        current = current[part];
    }

    return current;
};

const setValueByPath = (obj, path, value) => {
    const parts = path.split('.');
    let current = obj;

    for (let i = 0; i < parts.length - 1; i++) {
        if (!(parts[i] in current)) {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
};

const maskValue = (value, maskType, options) => {
    if (value === null || value === undefined) return value;

    switch (maskType) {
        case 'full':
            return '*'.repeat(String(value).length);
            
        case 'partial':
            const str = String(value);
            const visibleStart = options.visibleStart || 0;
            const visibleEnd = options.visibleEnd || 0;
            
            if (str.length <= visibleStart + visibleEnd) {
                return '*'.repeat(str.length);
            }
            
            const start = str.slice(0, visibleStart);
            const middle = '*'.repeat(str.length - visibleStart - visibleEnd);
            const end = str.slice(-visibleEnd);
            
            return start + middle + end;
            
        case 'email':
            const email = String(value);
            const [localPart, domain] = email.split('@');
            const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 1);
            return `${maskedLocal}@${domain}`;
            
        case 'custom':
            const maskChar = options.maskChar || '*';
            // Convert string pattern to RegExp object
            const pattern = options.pattern ? new RegExp(options.pattern, options.flags || 'g') : /./g;
            return String(value).replace(pattern, maskChar);
            
        default:
            return value;
    }
};

module.exports = {
    maskJsonValues
};