import mongoose from "mongoose"
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["child", "therapist"],
        default: "child",
    },
   

})

//compaing password
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Compare Passds

userSchema.methods.comparePassword = async function(userPassword) {
    return bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;
