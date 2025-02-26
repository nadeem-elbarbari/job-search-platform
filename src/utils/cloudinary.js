import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const updatePicture = async (user, file, folder, field) => {
    if (file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER}/${folder}/${user._id}`,
        });

        user[field] = { secure_url, public_id };
    }
    const result = await user.save({ validateBeforeSave: false });
    return result;
};

// Function to delete picture from Cloudinary
export const deletePictureFromCloudinary = async (user, pictureType) => {
    if (user[pictureType] && user[pictureType].public_id) {
        // Delete the image from Cloudinary using the public_id
        await cloudinary.uploader.destroy(user[pictureType].public_id);

        // Unset the picture field in the database
        user[pictureType] = undefined;
        await user.save({ validateBeforeSave: false });
    }
};

export default cloudinary;
