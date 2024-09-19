const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const AdminRegisterModel = require('./models/admin_register');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/intellievote_admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Admin Registration Route
app.post('/intellievote_admin/register', async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  
  // Check if email already exists
  const existingUser = await AdminRegisterModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newAdmin = new AdminRegisterModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,  // Store the hashed password
    confirmPassword: hashedPassword  // Store the hashed confirmPassword as well
  });
  
  newAdmin.save()
    .then(admin => res.json(admin))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  AdminRegisterModel.findOne({ email })
    .then(async (user) => {
      if (!user) {
        return res.status(400).json("User not found");
      }

      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.json("Login success");
      } else {
        res.status(400).json("Incorrect password");
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(3001, () => {
  console.log("Server is Running on port 3001");
});
