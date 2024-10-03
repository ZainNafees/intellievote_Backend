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

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const existingUser  = await AdminRegisterModel.findOne({ email });
  if (existingUser ) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new AdminRegisterModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    confirmPassword: hashedPassword,
    role: 'admin' // Default role to admin
  });

  newAdmin.save()
    .then(admin => res.json(admin))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Login Route
app.post('/intellievote_admin/login', (req, res) => {
  const { email, password } = req.body;

  AdminRegisterModel.findOne({ email })
    .then(async (user) => {
      if (!user) {
        return res.status(400).json("User  not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Include the role in the response
        return res.json({ message: "Login success", role: user.role });
      } else {
        return res.status(400).json("Incorrect password");
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});