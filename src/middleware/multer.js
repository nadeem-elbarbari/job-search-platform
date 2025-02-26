import multer from 'multer';

// Define the allowed file types for images and documents
export const FileTypes = {
    IMAGES: [
        'image/apng',
        'image/avif',
        'image/gif',
        'image/jpeg',
        'image/png',
        'image/svg+xml',
        'image/webp',
        'image/bmp',
        'image/x-icon',
        'image/tiff',
    ],
    DOCUMENTS: ['application/pdf'],
};

// Function to set up file upload with specific filters for allowed file types
const fileUpload = (fileTypes = []) => {
    // Set up the storage engine (where and how files will be stored)
    const storage = multer.diskStorage({});

    // The fileFilter function ensures only valid file types are uploaded
    function fileFilter(req, file, cb) {
        // If the file mimetype matches the allowed file types
        if (fileTypes?.includes(file.mimetype)) {
            cb(null, true); // All good! Let it pass.
        }
        // If the file mimetype doesn't match the allowed types
        else if (!fileTypes?.includes(file.mimetype)) {
            cb(new Error('InValid file format 🙅‍♂️')); // Error message for unsupported formats
        }
        // If something goes completely off the rails (just in case)
        else {
            cb(new Error("I don't have a clue! 🤷‍♂️")); // This should never happen... hopefully.
        }
    }

    // Return multer configuration with the storage engine and file filter
    return multer({ storage, fileFilter });
};

export default fileUpload;
