const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema(
    {
        id: ObjectId,
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        mobile_number: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        city: { type: String, required: true },
        password: { type: String, required: true },
        profile_pic: { type: String },
         },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
