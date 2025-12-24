const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        maxLength: 50
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid emailId");
            }
        }

    },
    phone: {
        type: String,
        minLength: 10,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Invalid gender");
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL");
            }
        }
    },
    about: {
        type: String,
        default: "This is the default about section. Please update it to something interesting!"
    },
    skills: {
        type: [String],
        default: []
    }
}, {timestamps: true });

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({_id: user._id}, 'jwtSecretKey', {expiresIn: '1d '});
    return token;
};

userSchema.methods.validatePassword = async function(password) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    return isPasswordValid;
}
module.exports = mongoose.model('User', userSchema);