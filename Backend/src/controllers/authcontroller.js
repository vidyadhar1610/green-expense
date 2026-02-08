import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/* ===================== REGISTER ===================== */
export const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // 1. Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already exists'
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and save user
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      message: 'Registration successful. Please login.'
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


/* ===================== LOGIN ===================== */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      {
        id: user._id,           //  consistent key
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      phone: user.phone
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// import bcrypt from 'bcrypt.js';
// import jwt from 'jsonwebtoken'
// import User from '../models/User.js';

// //register a new user;
// export const register=async(req,res)=>{
//     try{
//         //nothing to do much just take the req body and create a new user
//         const {username,email,contact,password}=req.body;
//         //checks whether the user already exists
//     const existingUser=await User.findOne({$or:[{email},{username}]})

// if(existingUser){
//     return res.status(400).json({message:"User with given email or username already exists"});
// }

// //hash the password
// const salt=await bcrypt.genSalt(10);
// const hashedPassword=await bcrypt.hash(password, salt);

// const newUser=await User.creatre(
//     {
//         username,
//         email,
//         contact,
//         password:hashedPassword
//     }
// )
// res.status(201).json({message:'user registered successfully'});

// }catch(err){
//     console.log("error in finding existing user during registration:"+ err.message);
//     return res.status(500).json({message:"Server error"});
// }
// }
// //login an existing user
// export const login=async(req,res)=>{
// //take the req body and find the user
// try{
//     const {usernameORemail,password}=req.body;
//     //check whether the user exists
//     const user=await User.findOne({$or:[{email:usernameORemail},{username:usernameORemail}]});
//     if(!user){
//         return res.status(400).json({message:"user does not exist"});
//     }
//     //compare passwords
//     const isMatch=await bcrypt.compare(password, user.password);
//     if(!isMatch){
//         return res.status(400).json({message:"Invalid Password"});
//     }

//     //generate jwt token
//     const token=jwt.sign(
//         {
//             userId:user._id,
//         },
//         process.env.JWT_SECRET,
//         {expiresIn:'1d'}
//     );

//     return res.status(200).json(
//         {
//             token,
//             user:{
//                 id:user_id,
//                 username:user.username,
//                 email:user.email,
//                 contact:user.contact
//             }
//         }
//     )

// }catch(err){
//     console.log("error in user login:"+ err.message);
//     return res.status(500).json({message:"Server error"});
// }

// }