const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/rapido', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function migrateUsers() {
  try {
    console.log('Starting user migration...');
    
    // Find users without phoneNumber or employeeId
    const usersToUpdate = await User.find({
      $or: [
        { phoneNumber: { $exists: false } },
        { phoneNumber: null },
        { phoneNumber: '' },
        { employeeId: { $exists: false } },
        { employeeId: null },
        { employeeId: '' }
      ]
    });
    
    console.log(`Found ${usersToUpdate.length} users that need migration`);
    
    for (const user of usersToUpdate) {
      console.log(`Updating user: ${user.email}`);
      
      const updates = {};
      
      // Set default phone number if missing
      if (!user.phoneNumber) {
        updates.phoneNumber = 'Not provided';
      }
      
      // Set default employee ID if missing
      if (!user.employeeId) {
        updates.employeeId = `EMP_${user._id.toString().slice(-6)}`;
      }
      
      if (Object.keys(updates).length > 0) {
        await User.findByIdAndUpdate(user._id, updates);
        console.log(`Updated user ${user.email} with:`, updates);
      }
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUsers(); 