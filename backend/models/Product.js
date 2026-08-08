const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        price: {
            type: Number,
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        attributes: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },


        images: [
            {
                type: String
            }
        ],

        sellerEmail: {
            type: String,
            required: true,
            default: "anonymous@circle.com"
        }

    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "Product",
    productSchema
);