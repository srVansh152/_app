import { useState, useEffect } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../../../utils/api'
import socketService from '../../../../services/socketService'
import CryptoJS from 'crypto-js'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Retrieve and decrypt the password when the component mounts
    const encryptedPassword = localStorage.getItem('adminPassword');
    if (encryptedPassword) {
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, 'secret-key');
      const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      console.log('Decrypted Admin Password:', decryptedPassword);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(formData);
      const response = await loginUser(formData)

      if (response.success && response.data.token) {
        // Save the token to local storage
        localStorage.setItem("token", response.data?.token);
        localStorage.setItem("Email", response.data?.email);
        localStorage.setItem('userId', response.data?._id);

        // Emit userConnected event
        const socket = socketService.connect();
        socket.emit('userConnected', response.data._id);

        // Get user role from response
        const userRole = response.data.role;

        // Encrypt and store the password if the user is an admin
        if (userRole.toLowerCase() === 'admin') {
          const encryptedPassword = CryptoJS.AES.encrypt(formData.password, 'secret-key').toString();
          localStorage.setItem('adminPassword', encryptedPassword);
        }

        // Redirect based on role
        switch(userRole.toLowerCase()) {
          case 'resident':
            navigate("/user/udashboard");
            break;
          case 'security':
            navigate("/security/Semergency");
            break;
          case 'admin':
            navigate("/admin/dashboard");
            break;
          default:
            console.error("Unknown role:", userRole);
            alert("Invalid user role");
        }
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with illustration and text */}
      <div className="hidden lg:flex lg:w-1/2 bg-white p-12 flex-col justify-between bg-[#F6F8FB]">
        <div className="mb-8">
        <div className="text-4xl font-bold text-orange-500">
            Dash<span className="text-gray-800">Stack</span>
          </div>

        </div>
        <div className="flex-grow  flex items-center justify-center">
          <img src="/image/Group.png.png" alt="Society Management Illustration" className="max-w-full h-auto" />
        </div>


      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md shadow-lg p-7 rounded-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Login</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email or Phone*
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter Your Phone Number or Email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password*
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link to='/password' href="#" className="font-medium text-orange-600 hover:text-orange-500">
                  Forgot Password ?
                </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to='/' href="#" className="font-medium text-orange-600 hover:text-orange-500">
              Registration
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login