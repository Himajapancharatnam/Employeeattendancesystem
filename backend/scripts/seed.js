const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const Attendance = require('../models/Attendance.model');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');

    // Clear existing data (optional - uncomment if you want to reset)
    // await User.deleteMany({});
    // await Attendance.deleteMany({});
    // console.log('Cleared existing data');

    // Check if manager exists
    let manager = await User.findOne({ email: 'manager@example.com' });
    
    if (!manager) {
      // Create manager
      manager = await User.create({
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'manager123',
        role: 'manager',
        employeeId: 'EMP001',
        department: 'Management',
        position: 'Manager'
      });
      console.log('Manager created:', manager.email);
    }

    // Create sample employees
    const employees = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP002',
        department: 'IT',
        position: 'Software Developer'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP003',
        department: 'HR',
        position: 'HR Specialist'
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP004',
        department: 'IT',
        position: 'DevOps Engineer'
      },
      {
        name: 'Sarah Williams',
        email: 'sarah@example.com',
        password: 'employee123',
        role: 'employee',
        employeeId: 'EMP005',
        department: 'Sales',
        position: 'Sales Executive'
      }
    ];

    const createdEmployees = [];
    for (const emp of employees) {
      let employee = await User.findOne({ email: emp.email });
      if (!employee) {
        employee = await User.create(emp);
        console.log('Employee created:', employee.email);
      }
      createdEmployees.push(employee);
    }

    // Create sample attendance records for the last 7 days
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      for (const employee of createdEmployees) {
        // Skip creating duplicate records
        const existing = await Attendance.findOne({
          user: employee._id,
          date: {
            $gte: new Date(date.setHours(0, 0, 0, 0)),
            $lte: new Date(date.setHours(23, 59, 59, 999))
          }
        });

        if (!existing) {
          const checkInTime = new Date(date);
          checkInTime.setHours(9, Math.floor(Math.random() * 30), 0, 0);
          
          const checkOutTime = new Date(checkInTime);
          checkOutTime.setHours(17 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0, 0);

          await Attendance.create({
            user: employee._id,
            date: date,
            checkIn: {
              time: checkInTime,
              location: 'Office',
              ipAddress: '192.168.1.1'
            },
            checkOut: {
              time: checkOutTime,
              location: 'Office',
              ipAddress: '192.168.1.1'
            },
            status: 'present'
          });
        }
      }
    }

    console.log('Sample attendance records created for the last 7 days');

    console.log('\n=== Seed Data Summary ===');
    console.log('Manager:', manager.email, '(password: manager123)');
    console.log('Employees created:', createdEmployees.length);
    createdEmployees.forEach(emp => {
      console.log(`  - ${emp.name} (${emp.email}) - password: employee123`);
    });

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
