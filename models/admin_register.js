const mongoose = require('mongoose');

const adminRegisterSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  confirmPassword: String,
  role: {
    type: String,
    default: 'admin' // Set the default role to 'admin'
  }
});

const AdminRegisterModel = mongoose.model('intellievote_admin', adminRegisterSchema);
module.exports = AdminRegisterModel;