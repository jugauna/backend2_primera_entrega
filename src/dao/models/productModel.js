import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    thumbnails: { type: Array, required: false, default: [] }
});

productSchema.plugin(mongoosePaginate);

export const productModel = mongoose.model('Product', productSchema);



// import mongoose from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

// const productCollection = "products";

// const productSchema = mongoose.Schema({
//     title: {
//         type: String,
//         require: true
//     },
//     description: {
//         type: String,
//         require: true
//     },
//     code: {
//         type: String,
//         require: true
//     },
//     price: {
//         type: Number,
//         require: true
//     },
//     stock: {
//         type: Number,
//         require: true
//     },
//     category: {
//         type: String,
//         require: true
//     },
//     thumbnails: {
//         type: Array,
//         require: false,
//         default: []
//     }
// });


// productSchema.plugin(mongoosePaginate);

// const productModel = mongoose.model(productCollection, productSchema);

// export default productModel;