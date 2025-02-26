// 🎮 Welcome to the Ultimate Validation Quest! 🏆
// The Guardian of API Land ensures only worthy adventurers (requests) may pass.

export const validation = (schema, options = { includeHeaders: false, includeFiles: false }) => {
    return (req, res, next) => {
        console.log('🎲 Rolling for validation...');

        // 🏹 Gather all inventory items (body, params, and query)
        let inputs = { ...req.body, ...req.params, ...req.query };

        // 📦 If file uploads are enabled, collect the loot!
        if (options.includeFiles && (req.file || req.files)) {
            const collectLoot = (req) => {
                if (Array.isArray(req.files)) return req.files; // Multiple treasures found!
                if (req.file) return [req.file]; // A single legendary artifact.
                return []; // No loot this time. 😢
            };

            inputs.attachments = collectLoot(req);
        }

        // 🔐 If headers are included, grab the access key (authorization token)
        if (options.includeHeaders && req.headers) {
            inputs.authorization = req.headers.authorization || '🔒 No Key Found!';
        }

        // 🧙‍♂️ The Wise Oracle (Joi) shall now judge the adventurer's worth!
        const { error } = schema.validate(inputs, { abortEarly: false });

        // 🚧 If the Oracle detects a flaw, the adventurer must return!
        if (error) {
            console.log('❌ Validation Failed! A wild error appears!');
            const errorMsg = new Error(error.message.replace(/"/g, ''), { cause: 400 });
            return next(errorMsg); // Send them back to the village (error handler)
        }

        // 🌟 Validation Passed! Level Up! Proceed to the next middleware.
        console.log('✅ Validation Success! The adventurer may pass.');
        return next();
    };
};
