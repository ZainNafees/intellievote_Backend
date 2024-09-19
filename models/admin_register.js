const mongoose = require('mongoose');

const adminRegisterSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    confirmPassword: String
});

const AdminRegisterModel = mongoose.model('intellievote_admin', adminRegisterSchema);
module.exports = AdminRegisterModel;
