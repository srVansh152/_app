import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { verifyOtp, forgotPassword } from '../../../../utils/api'; // Adjust the import path based on your project structure.

export default function Component() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setResendDisabled(false); // Enable Resend button after timer expires
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle OTP input changes
  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle Backspace key navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

// Verify OTP logic
const handleVerifyOtp = async () => {
  const otpCode = otp.join(''); // Join OTP digits entered by the user
  if (otpCode.length !== 6) {
    alert('Please enter the complete 6-digit OTP.');
    return;
  }

  try {
    const email = localStorage.getItem('emailForOtp'); // Retrieve email from localStorage
    if (!email) {
      alert('Email not found in local storage. Please try again.');
      return;
    }

    // Make the request to verify OTP
    const response = await verifyOtp({ email, otp: otpCode });
    if (response.success) {
      localStorage.setItem('otp', otpCode);
      navigate('/reset'); // Redirect to reset page on success
    } else {
      alert(response.message || 'OTP verification failed.');
    }
  } catch (error) {
    alert('An error occurred while verifying OTP.');
    console.error('OTP Verification Error:', error);
  }
};


  // Resend OTP logic
  const handleResendOtp = async () => {
    try {
      setResendDisabled(true); // Disable the button while processing
      setTimeLeft(30); // Restart timer

      const email = localStorage.getItem('emailForOtp'); // Retrieve email from storage
      if (!email) {
        alert('Email not found. Please try again.');
        return;
      }

      const response = await forgotPassword(email);
      if (response.success) {
        alert('OTP resent successfully.');
      } else {
        alert(response.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      alert('An error occurred while resending OTP.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with illustration and text */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between bg-gray-50">
        <div className="mb-8">
          <div className="text-4xl font-bold text-orange-500">
            Dash<span className="text-gray-800">Stack</span>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <img src="/image/reset.png" alt="Society Management Illustration" className="max-w-full h-auto" />
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 z-0">
          <img src="public/image/vector.png" className="object-cover w-full h-full" alt="Background Vector" />
        </div>
        <div className="w-full max-w-md shadow-lg p-6 rounded-md bg-white z-10">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Enter OTP</h2>
          <p className="text-center text-gray-600 mb-6">
            Please enter the 6-digit code that was sent to your phone number.
          </p>
          <div className="flex justify-between mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:border-orange-500 focus:outline-none"
              />
            ))}
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-600">
              {timeLeft > 0 ? `00:${timeLeft.toString().padStart(2, '0')} sec` : 'Time expired'}
            </span>
            <button
              className={`text-sm ${resendDisabled ? 'text-gray-400' : 'text-orange-500 hover:text-orange-600'}`}
              disabled={resendDisabled}
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          </div>
          <button
            onClick={handleVerifyOtp}
            className="w-full flex justify-center bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition duration-300"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}
