import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../../../utils/api';

function ForgetPassword() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await forgotPassword(emailOrPhone);

      if (data) {
        setMessage({ type: 'success', text: 'OTP sent successfully! Check your email.' });
        // Store email in localStorage for use on the OTP page
        localStorage.setItem('emailForOtp', emailOrPhone);
        // Adding a slight delay before navigation to show the success message
        setTimeout(() => {
          navigate('/otp'); // Redirect to OTP page after success
        }, 500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to send OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F6F8FB] p-12 flex-col justify-between items-center">
        <div className="w-full">
        <div className="mb-8">
        <div className="text-4xl font-bold text-orange-500">
            Dash<span className="text-gray-800">Stack</span>
          </div>

        </div>
        </div>
        <img
          src="/image/forget.jpg"
          alt="Password Reset Illustration"
          className="max-w-full"
        />
        <div className="w-full" />
      </div>

      {/* Right side with forget password form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full shadow-lg p-6 max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forget Password</h2>
          <p className="text-gray-600 mb-8">
            Enter your email and we'll send you an OTP to reset your password.
          </p>

          {message.text && (
            <div
              className={`p-4 rounded-md mb-4 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="emailOrPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Email*
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading
                    ? 'bg-orange-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500'
                }`}
              >
                {loading ? 'Sending...' : 'Get OTP'}
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link
              to="/login"
              href="#"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
