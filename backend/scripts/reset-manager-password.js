const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

dotenv.config();

const resetManagerPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Find manager
    const manager = await User.findOne({ email: 'manager@example.com' });
    
    if (!manager) {
      console.log('Manager not found. Creating new manager account...');
      const hashedPassword = await bcrypt.hash('manager123', 10);
      const newManager = await User.create({
        name: 'Manager User',
        email: 'manager@example.com',
        password: hashedPassword,
        role: 'manager',
        employeeId: 'EMP001',
        department: 'Management',
        position: 'Manager'
      });
      console.log('✅ Manager account created successfully!');
      console.log('Email: manager@example.com');
      console.log('Password: manager123');
    } else {
      console.log('Manager found. Resetting password...');
      // Reset password
      const salt = await bcrypt.genSalt(10);
      manager.password = await bcrypt.hash('manager123', salt);
      await manager.save();
      console.log('✅ Manager password reset successfully!');
      console.log('Email: manager@example.com');
      console.log('Password: manager123');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetManagerPassword();
