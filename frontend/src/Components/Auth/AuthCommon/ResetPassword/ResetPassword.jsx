import { useState } from 'react';
import { resetPassword } from '../../../../utils/api'; // Adjust the import path if needed
import { useNavigate, useNavigationType } from 'react-router';

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    try {
      // Retrieve email/phone and OTP from localStorage
      const emailOrPhone = localStorage.getItem('emailForOtp');
      const otp = localStorage.getItem('otp');
      console.log(otp);

      if (!emailOrPhone || !otp) {
        alert('Missing OTP or email/phone. Please try the reset process again.');
        return;
      }

      // Prepare reset data
      const resetData = { emailOrPhone, otp, newPassword };

      // Call the resetPassword API function
      const response = await resetPassword(resetData);

      if (response.success) {
        alert('Password reset successful!');
        // Clear localStorage
        localStorage.removeItem('emailOrPhone');
        localStorage.removeItem('otp');
        return navigate('/login');
      } else {
        alert(`Failed to reset password: ${response.message}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden sm:flex flex-1 flex-col p-8">
      <div className="mb-8">
      <div className="text-4xl font-bold text-orange-500">
            Dash<span className="text-gray-800">Stack</span>
          </div>

        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/image/reset.png"
            alt="Password reset illustration"
            className="max-w-full object-contain"
          />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Reset Password</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                New Password*
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={showPassword ? 'M6 18L18 6M6 6l12 12' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'}
                    />
                    {!showPassword && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password*
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={showConfirmPassword ? 'M6 18L18 6M6 6l12 12' : 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'}
                    />
                    {!showConfirmPassword && (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
