// create a document or array of documents
export const create = async (model, data) => {
    const result = await model.create(data);
    return result;
};

// find all documents
export const find = async (model, query, populate = [], select = '', skip = 0, limit = 100) => {
    const result = await model.find(query).populate(populate).select(select).skip(skip).limit(limit).lean();
    return result;
};

// find one document
export const findOne = async (model, query, populate = [], select = '') => {
    const result = await model.findOne(query).populate(populate).select(select);
    return result;
};

// find one document by id
export const findById = async (model, id, populate = [], select = '') => {
    const result = await model.findById(id).populate(populate).select(select).lean();
    return result;
};

// update one document by id
export const updateById = async (model, id, data, populate = [], select = '') => {
    const result = await model.findByIdAndUpdate(id, data, { new: true }).populate(populate).select(select).lean();
    return result;
};

// update one document
export const updateOne = async (model, query, data, populate = [], select = '') => {
    const result = await model.findOneAndUpdate(query, data, { new: true }).populate(populate).select(select).lean();
    return result;
};

// update many documents
export const updateMany = async (model, query, data) => {
    const result = await model.updateMany(query, data);
    return result;
};

// delete one document
export const deleteOne = async (model, query) => {
    const result = await model.deleteOne(query);
    return result;
};
