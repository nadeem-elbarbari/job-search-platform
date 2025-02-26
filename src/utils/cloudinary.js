import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const updatePicture = async (doc, file, folder, field) => {
    if (file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/${folder}/${doc._id}`,
        });

        doc[field] = { secure_url, public_id };
    }
    const result = await doc.save({ validateBeforeSave: false });
    return result;
};

export const uploadMultipleFiles = async (files, folder, entity) => {
    let result = [];
    for (const file of files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/${folder}/${entity}`,
        });
        result.push({ secure_url, public_id });
    }
    return result;
};

// Function to delete picture from Cloudinary
export const deletePictureFromCloudinary = async (doc, pictureType) => {
    if (doc[pictureType] && doc[pictureType].public_id) {
        // Delete the image from Cloudinary using the public_id
        await cloudinary.uploader.destroy(doc[pictureType].public_id);

        // Unset the picture field in the database
        doc[pictureType] = undefined;
        await doc.save({ validateBeforeSave: false });
    }
};

export default cloudinary;
