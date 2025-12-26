const validator = require("validator");

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password, age } = req.body;
    if(!firstName || !lastName){
        throw new Error("First name and last name are required");
    } else if(firstName.length > 50 || lastName.length > 50){
        throw new Error("First name and last name should be less than 50 characters");
    } else if(firstName.length<4 || lastName.length<4){
        throw new Error("First name and last name should be at least 4 characters");
    } else if(!validator.isEmail(emailId)){
        throw new Error("Invalid email format");
    } else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    } else if(!age || age < 0){
        throw new Error("Invalid age");
    }
}


const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "phone", "age", "skills", "photoUrl", "about"];
    const isEditAllowed = Object.keys(req.body).every((field)=>allowedEditFields.includes(field));
    console.log("isEditAllowed", isEditAllowed);
    return isEditAllowed;
}
module.exports = { validateSignupData, validateEditProfileData };