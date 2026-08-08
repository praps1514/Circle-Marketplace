require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Category = require("./models/Category");

const categoriesToSeed = [
  {
    name: "Mobile Phones",
    fields: [
      {
        label: "Brand",
        type: "text",
        required: true,
        options: []
      },
      {
        label: "Storage",
        type: "select",
        required: false,
        options: ["64GB", "128GB", "256GB", "512GB", "1TB"]
      },
      {
        label: "Condition",
        type: "select",
        required: false,
        options: ["New", "Like New", "Good", "Fair"]
      }
    ]
  },
  {
    name: "Laptops",
    fields: [
      {
        label: "Brand",
        type: "text",
        required: true,
        options: []
      },
      {
        label: "RAM",
        type: "select",
        required: false,
        options: ["4GB", "8GB", "16GB", "32GB", "64GB"]
      },
      {
        label: "Storage",
        type: "select",
        required: false,
        options: ["256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"]
      },
      {
        label: "Processor",
        type: "text",
        required: false,
        options: []
      },
      {
        label: "Condition",
        type: "select",
        required: false,
        options: ["New", "Like New", "Good", "Fair"]
      }
    ]
  },
  {
    name: "Vehicles",
    fields: [
      {
        label: "Brand",
        type: "text",
        required: true,
        options: []
      },
      {
        label: "Model",
        type: "text",
        required: true,
        options: []
      },
      {
        label: "Year",
        type: "number",
        required: false,
        options: []
      },
      {
        label: "Fuel Type",
        type: "radio",
        required: false,
        options: ["Petrol", "Diesel", "Electric", "Hybrid"]
      },
      {
        label: "Condition",
        type: "select",
        required: false,
        options: ["New", "Used"]
      }
    ]
  },
  {
    name: "Fashion",
    fields: [
      {
        label: "Brand",
        type: "text",
        required: false,
        options: []
      },
      {
        label: "Size",
        type: "select",
        required: false,
        options: ["XS", "S", "M", "L", "XL", "XXL"]
      },
      {
        label: "Gender",
        type: "radio",
        required: false,
        options: ["Men", "Women", "Unisex"]
      },
      {
        label: "Condition",
        type: "select",
        required: false,
        options: ["New", "Like New", "Good", "Fair"]
      }
    ]
  },
  {
    name: "Home & Furniture",
    fields: [
      {
        label: "Item Type",
        type: "text",
        required: true,
        options: []
      },
      {
        label: "Material",
        type: "text",
        required: false,
        options: []
      },
      {
        label: "Condition",
        type: "select",
        required: false,
        options: ["New", "Like New", "Good", "Fair"]
      },
      {
        label: "Color",
        type: "text",
        required: false,
        options: []
      }
    ]
  },
  {
    name: "Electronics",
    fields: [
      {
        label: "Brand",
        type: "text",
        required: true,
        options: []
      },
      {
        label: "Model",
        type: "text",
        required: false,
        options: []
      },
      {
        label: "Warranty",
        type: "select",
        required: false,
        options: ["None", "3 Months", "6 Months", "1 Year", "2 Years"]
      },
      {
        label: "Condition",
        type: "select",
        required: false,
        options: ["New", "Like New", "Good", "Fair"]
      }
    ]
  }
];

async function seedCategories() {
  try {
    await connectDB();
    console.log("Seeding categories into MongoDB Atlas...");

    for (const cat of categoriesToSeed) {
      const updatedCat = await Category.findOneAndUpdate(
        { name: cat.name },
        { $set: { fields: cat.fields } },
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`✅ Category ready: "${updatedCat.name}" with ${updatedCat.fields.length} fields`);
    }

    const totalCategories = await Category.countDocuments();
    console.log(`🎉 Seeding complete! Total categories in DB: ${totalCategories}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    process.exit(1);
  }
}

seedCategories();
