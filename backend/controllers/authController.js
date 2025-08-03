const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

exports.register = async (req, res) => {
  try {
    console.log('=== REGISTRATION START ===');
    console.log('Request body:', req.body);
    
    const { name, email, password, phoneNumber, employeeId, role } = req.body;
    
    console.log('Extracted fields:', {
      name,
      email,
      phoneNumber,
      employeeId,
      role,
      hasPassword: !!password
    });
    
    // Validate input for new registrations
    if (!name || !email || !password || !phoneNumber || !employeeId) {
      console.log('❌ Validation failed - missing fields:', {
        hasName: !!name,
        hasEmail: !!email,
        hasPassword: !!password,
        hasPhoneNumber: !!phoneNumber,
        hasEmployeeId: !!employeeId
      });
      return res.status(400).json({ message: "All fields are required for registration" });
    }

    console.log('✅ Validation passed');

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Check for existing employee ID
    const existingEmployeeId = await User.findOne({ employeeId });
    if (existingEmployeeId) {
      return res.status(400).json({ message: "Employee ID already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      password: hashed, 
      phoneNumber,
      employeeId,
      role: role || "user" // Default to "user" if no role specified
    });
    
    console.log('📝 Creating user object:', {
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      employeeId: newUser.employeeId,
      role: newUser.role
    });
    
    await newUser.save();
    
    console.log('💾 User saved successfully with ID:', newUser._id);
    console.log('📊 Final saved user data:', {
      name: newUser.name,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      employeeId: newUser.employeeId,
      role: newUser.role,
      createdAt: newUser.createdAt
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      message: "User registered successfully", 
      token,
      user: { 
        id: newUser._id, 
        name: newUser.name, 
        email: newUser.email, 
        phoneNumber: newUser.phoneNumber,
        employeeId: newUser.employeeId,
        role: newUser.role 
      } 
    });
    
    console.log('✅ Registration completed successfully');
    console.log('=== REGISTRATION END ===');
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phoneNumber: user.phoneNumber,
        employeeId: user.employeeId,
        role: user.role 
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

exports.fetchUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err);  
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};