const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    value: '{VALUE} is not a role allowed'
}

const userSchema = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, unique:true, required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'Password is required'] },
    img: { type: String, required: false },
    role: { type: String, required: [true, 'Role is required'], default: 'USER_ROLE', enum : roles },
    google: {type: Boolean, require: true, default: false },
});

userSchema.plugin(uniqueValidator, {message: '{PATH} must be unique'});

module.exports = mongoose.model('User', userSchema);