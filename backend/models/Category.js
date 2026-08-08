const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        fields: [
            {
                label: {
                    type: String,
                    required: true
                },

                type: {
                    type: String,
                    required: true
                },

                options: [
                    {
                        type: String
                    }
                ],

                required: {
                    type: Boolean,
                    default: false
                }
            }
        ]
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "Category",
    categorySchema
);