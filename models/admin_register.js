const mongoose = require('mongoose');

const adminRegisterSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    confirmPassword: String,
    role: { type: String, default: 'admin' } // Adding the role field
});

const AdminRegisterModel = mongoose.model('intellievote_admin', adminRegisterSchema);
module.exports = AdminRegisterModel;