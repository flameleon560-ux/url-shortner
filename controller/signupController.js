const User = require("../model/signupModel"); // avoid naming conflict
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { setUser } = require("../services/auth");
const jwt = require('jsonwebtoken');
const path=require('path');
const fs=require('fs');


async function handleUserSignup(req, res) {
try{

  const salt = bcrypt.genSaltSync(10);
  console.log("salt", salt);
  // const hash=bcrypt.hashSync(req.body.password,salt)
  const password = bcrypt.hashSync(req.body.password, salt)

  // const { username, email, password } = req.body;
  const { username, email, } = req.body;
  const file= req.file;

  if (!username || !password || !email || !file) {
    return res.status(400).json({ error: "All fields are required" });
  }
 const user = await User.findOne({ $or: [{ username }, { email }] });
  if (user) {
    return res.render('signup',{ error: "Username or email already exists"});
  }
  const uploadDir=path.join(__dirname,"../uploads");
  if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
  }
  const profile=Date.now() +"_"+ file.originalname;
  const filepath=path.join(uploadDir,profile);
  fs.writeFileSync(filepath,file.buffer);
  await User.create({
    username,
    email,
    password,
    profile
  });
  return res.render('login',{message :"login successful",error:null});}
  catch (error){
    logger.error("this is error signup controller",error);
    return res.redriect('signup',{error:"something went wrong"});
  }

}


async function handleUserLogin(req, res) {
  // const { username, password } = req.body;      //old
  // const user = await User.findOne({ username, password });

  const { username } = req.body;
  const user = await User.findOne({ username });

  if (!user || !bcrypt.compareSync(req.body.password, user.password))
    return res.render("login", {
      error: "Invalid Username or Password",
      message:null
    });


  const token = setUser(user);
  res.cookie("uid", token);

  return res.redirect("/");
  // return res.json({token});
}

async function handleForgotPassword(req, res) {
  let otp = Math.floor(1000 + Math.random() * 9000);


  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" })
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" })
  user.passwordRestToken = otp;
  user.passwordRestExpires = Date.now() + 10 * 60 * 1000; //10 minutes
  await user.save();
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      // user:"flameleon560@gmail.com",
      // pass:"tfspspdickpdcavm"
      user: process.env.email_user,
      pass: process.env.eamail_pass

    },
  });


  const info = await transporter.sendMail({
    from: "process.env.email_user",
    to: user.email,
    subject: "Password Reset",
    text: `Click on the link to reset your password ${otp}`,
  })
 res.render("verifyOtp", { email });

;
}

async function handleverifyOtp(req, res) {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    passwordRestToken: otp,
    passwordRestExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(404).json({ error: "Invalid otp or session expired" })
  // const authToken = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '10m' });
  // if(otp!==store.otp)return res.status(400).json({error:"Invalid otp"})
  return res.render("resetpassword", { email });
}

async function handleResetPassword(req, res) {
  const { newPassword, confirmPassword, email } = req.body;
  // console.log("authToken", authToken);
  if (!newPassword || !confirmPassword) return res.status(400).json({ error: "All fields are required" })
  if (newPassword !== confirmPassword) return res.status(400).json({ error: "Password not matched" })
 
    // const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    const user = await User.findOne({ email
     });
    if (!user) return res.status(404).json({ error: "session expired" })
    const salt = bcrypt.genSaltSync(10);
    const newPasswordpassword = bcrypt.hashSync(newPassword, salt)
    user.password = newPasswordpassword;
    await user.save();

    return res.render("login");
  
}
module.exports = { handleUserSignup, handleUserLogin, handleForgotPassword, handleverifyOtp, handleResetPassword }; 