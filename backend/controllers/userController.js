import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/user.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true, 
  auth: {
    user: "d69384296@gmail.com",
    pass: "rfigjfbyysfoikjp",
  },
});



export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  sendToken(user, 201, res, "User Registered!");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email ,password and role."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  if (user.role !== role) {
    return next(
      new ErrorHandler(`User with provided email and ${role} not found!`, 404)
    );
  }
  sendToken(user, 201, res, "User Logged In!");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});

export const otpSend =catchAsyncErrors(async (req,res,next) => {
  const { _id , email } = req.user;
  
  // Generate OTP
  const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, specialChars: false, upperCaseAlphabets: false });
  const date = new Date();
      
    const usr =await User.findByIdAndUpdate(_id, { otp:otp , otpTimestamp:date} ,{
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

  
      transporter.sendMail({
        from: process.env.GMAIL,
        to: email,
        subject: 'Email Verification OTP',
        text: `Your OTP for email verification is: ${otp}`
        }, (error, info) => {
        if (error) {
          console.log(error);
          res
            .status(201)
            .json({
              success: false,
              message: "email has not sent ",
            });
        } else {
          //console.log('Email sent: ' + info.response);
            //email ja chuka hai 
            
            res
            .status(201)
            .json({
              success: true,
              message: "Email has sent Successfully.",
              usr
            });
          
        }
    });

})

export const verification = catchAsyncErrors(async (req,res,next) => {
   const { OTP } = req.body;
   const { _id } = req.user;

  const usr = await User.findById(_id).select("+otp +otpTimestamp");

     // Check if OTP has expired (1 minute expiry)
  const now = new Date();
  const otpExpiry = new Date(usr.otpTimestamp.getTime() + 2*60000); // 1 minute expiry
  if (now > otpExpiry) {
          res
            .status(400)
            .json({
              success: false,
              message: "otp has expired"
            });
  }else{
    if(OTP == usr.otp){
          const user = await User.findByIdAndUpdate(_id, {emailVarified:true},{
             new: true,
              runValidators: true,
              useFindAndModify: false,
          });
          res
            .status(201)
            .json({
              success: true,
              message: "email is varified!",
              user
            });

    }else{
      //match nahi hoga 
          res
            .status(400)
            .json({
              success: false,
              message: "otp is wrong!"
            });
    }
  }
});


export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
