const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },

    last_name: {
      type: String,
      required: true,
    },

    mobile_number: {
      type: String,
      required: true,
      // Optional: You can add a regex for validating phone number formats here (e.g., simple format)
      match: [/^\d{10}$/, "Please enter a valid mobile number."],
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Please enter a valid email address."],
    },

    password: {
      type: String,
      required: true,
    },

    profile_pic: {
      type: String,
      // Optional: Validate that profile_pic is a URL if it's supposed to be a link to an image.
      match: [/^https?:\/\/\S+\.\S+$/, "Please enter a valid URL for the profile picture."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
