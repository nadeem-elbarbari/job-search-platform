// Validation Middleware: Ensures request data conforms to the specified schema before proceeding.

export const validation = (
    schema, // Joi schema used for data validation
    options = { includeHeaders: false, includeFiles: false }, // Configuration options for including headers and file data
    fieldName = 'attachments' // Field name for file uploads (defaults to 'attachments')
) => {
    return (req, res, next) => {
        // Log the start of the validation process
        console.log('Starting validation process.');

        // Combine request body, query parameters, and URL parameters for validation
        let inputs = { ...req.body, ...req.params, ...req.query };

        // If file uploads are required, collect the files from the request
        if (options.includeFiles && (req.file || req.files)) {
            const collectFiles = (req) => {
                if (Array.isArray(req.files)) return req.files; // Handle multiple files
                if (req.file) return [req.file]; // Handle single file upload
                return []; // No files found
            };

            inputs[fieldName] = collectFiles(req);
        }

        // If headers need to be validated, include authorization token or other header data
        if (options.includeHeaders && req.headers) {
            inputs.authorization = req.headers.authorization; // Collect authorization token if available
        }

        // Perform schema validation using Joi
        const { error } = schema.validate(inputs, { abortEarly: false });

        // If validation fails, return a descriptive error
        if (error) {
            console.error('Validation failed:', error.message);
            const errorMsg = new Error(error.message.replace(/"/g, ''), { cause: 400 });
            return next(errorMsg); // Forward the error to the error handling middleware
        }

        // Validation passed; proceed to the next middleware or route handler
        console.log('Validation successful; proceeding to the next middleware.');
        return next();
    };
};
