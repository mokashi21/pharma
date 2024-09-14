const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const CheckIn = require("./models/CheckIn");
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error", err));

// JWT Middleware for verifying token
function verifyToken(req, res, next) {
  const token = req.header("auth-token");
  console.log("token", token);

  if (!token) return res.status(401).json("Access denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verified", verified);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json("Invalid token");
  }
}

// track location
app.post("/track-location", verifyToken, async (req, res) => {
  const { latitude, longitude } = req.body;
  console.log("long", latitude, longitude)

  if (latitude === undefined || longitude === undefined) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    await user.save();
    res.status(200).json({ message: "Location tracked successfully" });
  } catch (error) {
    console.log("Error", error);
  }
});

// check 
app.post("/check-in", verifyToken, async (req, res) => {
  const { empId } = req.body; // Only `empId` is needed for check-in, not `checkIn` from the request body
  const today = new Date().setHours(0, 0, 0, 0); // Get today's date with time reset to midnight

  console.log("Checking check-in for empId:", empId);

  if (!empId) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  try {
    const existingCheckIn = await CheckIn.findOne({
      empId,
      checkIn: { $gte: today }  
    });

    if (existingCheckIn) {
      return res.status(401).json({ message: "Already checked in for today" });
    }

    // Create a new check-in record
    const newCheckIn = new CheckIn({
      empId,
      checkIn: new Date() // Store the current date and time
      
    });

    await newCheckIn.save();

    res.json({ message: 'Checked in successfully', checkIn: newCheckIn.checkIn });
  } catch (error) {
    console.error("Error during check-in:", error);
    res.status(500).json({ message: "Server error during check-in" });
  }
});

// check in status
app.get("/check-in-status", verifyToken, async (req, res) => {
  try {
    const { empId } = req.user; // assuming empId is available in req.user

    const today = new Date().setHours(0, 0, 0, 0);
    const existingCheckIn = await CheckIn.findOne({
      empId,
      checkIn: { $gte: today }
    });

    if (existingCheckIn) {
      return res.json({ checkInTime: existingCheckIn.checkIn });
    }

    res.json({ checkInTime: null });
  } catch (error) {
    res.status(500).json({ message: "Error fetching check-in status" });
  }
});


// Register Route
app.post("/register", async (req, res) => {
  const { name, role, empId, email, password } = req.body;

  if (!name || !empId || !password || !role || (role === "admin" && !email)) {
    return res
      .status(400)
      .json({ message: "All fields are required for registration" });
  }

  try {
    const existingUser = await User.findOne({ empId });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this Employee ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      empId,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { empId, password, email } = req.body;

  try {
    const user = await User.findOne({ empId });
    if (!user) return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    // Admin requires email for login validation
    if (user.role === "admin" && user.email !== email) {
      return res
        .status(400)
        .json({ message: "Admin requires valid email for login" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role, empId: user.empId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Store token in cookies if desired
    // Store token in cookies if desired
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({
      message: "Login successful",
      token,
      empId: user.empId,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

// Logout route
app.delete("/logout", verifyToken, (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
});

// Admin-only route (fetch all medical rep details)
app.get("/admin/medical-reps", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json("Access denied. Admins only.");
  }

  try {
    // const medicalReps = await User.find(
    //   { role: "medical_rep" },
    //   { password: 0 }
    // ); 
    // res.status(200).json(medicalReps);
    const checkIns = await CheckIn.find().populate('empId');
    const userswithcheckins = await Promise.all(checkIns.map( async (checkIn) => {
      const user = await User.findOne({ empId : checkIn.empId});
      return {
        empId : user.empId,
        email  : user.email,
        checkInTime : checkIn.checkIn,
        location : user.location
      }
    } ) )
  
    console.log("all data",userswithcheckins)
    console.log("all checks",checkIns)

    res.json(userswithcheckins)


  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

// Logout Route
app.delete("/logout", verifyToken, (req, res) => {
  try {
    // Clear the JWT token from the cookies
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error });
  }
});

// Catch all 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
