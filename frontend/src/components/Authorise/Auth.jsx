import React, { useState  , useContext , useEffect} from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
import { Context } from "../../main"

const  EmailVerification = () => {
  const { isAuthorized, user } = useContext(Context);
  

  // console.log(user);
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [ balance , setBalance] =useState('');
  const [OTP,setOtp] = useState('');

  useEffect(()=>{
    try{
      if(isAuthorized){
        axios
            .get("http://localhost:4000/api/v1/user/getuser", {
              withCredentials: true,
            })
            .then((res) => {
              
              setBalance(() => res.data.user.balance)
            });
      }
    }catch{
      toast.error(error.response.data.message);
    }
  },[isAuthorized]);
  
  

  
  
  useEffect(() => {
   
    
    if(isAuthorized && user.emailVarified){
      setVerificationStatus(true);
    }
    
     
  },[isAuthorized, user.emailVarified ]);
 
   
  

  const sendOTP = async(e) => {
     e.preventDefault();
     try{
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/OTP-send",
        { },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
    }catch (error) {
      toast.error(error.response.data.message);
    }
  };




  const verifyEmailWithOTP = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/verify-otp",
        { OTP },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(data.message);
      setVerificationStatus(true);


    } catch (error) {
      setError(error.response.data.error);
    }
  };


  return (
    <>
      <h1>Balance is: {balance}</h1>
      <h1>Email Verification</h1>
      {verificationStatus ? 
      (
        <p>{user.email} is varified {verificationStatus}</p>
      ) : 
      (
        <>
          <p>Enter the OTP received on your email to verify your email address.</p>
          <button onClick={sendOTP}>Send OTP</button>
          <input 
             type="text" 
             placeholder="Enter OTP" 
             value={OTP}
             onChange={(e) => setOtp(e.target.value)} 
          />
          <button onClick={verifyEmailWithOTP}>Verify Email</button>
        </>
      )}
    </>
  );
};

export default EmailVerification;