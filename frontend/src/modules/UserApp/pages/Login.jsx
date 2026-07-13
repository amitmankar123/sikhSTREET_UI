import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../../shared/store/authStore';
import { useCartStore } from '../../../shared/store/useStore';
import { useWishlistStore } from '../../../shared/store/wishlistStore';
import {
  clearPostLoginRedirect,
  consumePostLoginAction,
  getPostLoginRedirect,
} from '../../../shared/utils/postLoginAction';
import { isValidEmail } from '../../../shared/utils/helpers';
import toast from 'react-hot-toast';
import MobileLayout from '../components/Layout/MobileLayout';
import PageTransition from '../../../shared/components/PageTransition';

const MobileLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const storedFrom = getPostLoginRedirect();
  const from = location.state?.from?.pathname || storedFrom || '/home';

  const replayPendingAction = () => {
    const action = consumePostLoginAction();
    if (!action?.type) return;

    if (action.type === 'cart:add' && action.payload) {
      useCartStore.getState().addItem(action.payload);
      return;
    }

    if (action.type === 'wishlist:add' && action.payload) {
      useWishlistStore.getState().addItem(action.payload);
    }
  };

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password, rememberMe);
      replayPendingAction();
      toast.success('Login successful!');
      clearPostLoginRedirect();
      navigate(from === '/login' ? '/home' : from, { replace: true });
    } catch (error) {
      const backendMessage = String(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        ''
      );
      const message = String(error?.message || '');
      const normalized = `${backendMessage} ${message}`.toLowerCase();

      if (
        normalized.includes('email not verified') ||
        normalized.includes('verify your email')
      ) {
        navigate('/verification', {
          state: { email: String(data.email || '').trim().toLowerCase() },
          replace: true,
        });
        return;
      }
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <PageTransition>
      <MobileLayout showBottomNav={false} showCartBar={false}>
        <div className="w-full min-h-screen bg-gradient-to-br from-[#fff7f2] via-[#ffece0] to-[#fff7f2] flex items-start justify-center px-4 pt-8 pb-12 relative overflow-hidden font-sans">
          {/* Decorative Saffron Blurs */}
          <div className="absolute top-20 left-[-15%] w-[400px] h-[400px] rounded-full bg-[#f1641e]/5 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 right-[-15%] w-[400px] h-[400px] rounded-full bg-[#8d4b00]/5 blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="backdrop-blur-md bg-white/70 border border-[#ebdcd0]/50 rounded-3xl p-6 shadow-xl">
              {/* Logo & Header */}
              <div className="text-center mb-6 flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-2xl bg-[#8d4b00]/10 p-2 shadow-inner mb-3">
                  <img
                    className="w-full h-full object-contain"
                    alt="sikhSTREET logo"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_QtluDyTyyTERMfRfd830u3RcIkF7aJHRbM37FYnRFNCY01_N74tx3WAK0zGIr3PEXlqhIdcITnhHLXC5x87LHZKdO0BvuQbZI88UlL9d0hYbgyyGowhWYN-gBgtlmM2Rr0o6e4YSkF9e4x6vS7jZY4SqZ65AXuXlAHqSnNDUs613UTccW7ylV1CyRVm_9MFrt9ceJxGerEQ2cFT2rZUFNVaq3a900_TuKdoUrotAgb_cjLr3F4-CNsxx4qut7UFp75j3KGaXtxvHxG8"
                  />
                </div>
                <h1 className="text-2xl font-black text-gray-900 font-serif tracking-wide">Welcome Back</h1>
                <p className="text-xs text-[#554336]/80 mt-1">Login to access your sikhSTREET account</p>
              </div>
 
              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        validate: (value) =>
                          !value || isValidEmail(value) || 'Please enter a valid email',
                      })}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm ${errors.email
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200/80 focus:border-[#8d4b00]'
                        } focus:outline-none transition-colors text-base`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
 
                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm ${errors.password
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200/80 focus:border-[#8d4b00]'
                        } focus:outline-none transition-colors text-base`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
 
                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#8d4b00] border-gray-300 rounded focus:ring-[#8d4b00]"
                    />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-[#8d4b00] hover:text-[#6e3900] font-medium"
                  >
                    Forget password?
                  </Link>
                </div>
 
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#f1641e] to-[#8d4b00] text-white py-3.5 rounded-xl font-bold text-base transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
 
              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-[#8d4b00] hover:text-[#6e3900] font-semibold"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    </PageTransition>
  );
};

export default MobileLogin;
