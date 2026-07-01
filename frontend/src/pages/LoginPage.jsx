import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
            token: credentialResponse.credential
        });
        if (res.data.success) {
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        }
    } catch (error) {
        console.error('Login gagal', error);
        alert('Gagal login menggunakan Google.');
    }
  };

  const handleManualLogin = (e) => {
    e.preventDefault();
    console.log("Login manual ditekan");
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gray-50 bg-cover bg-center p-4 sm:p-8"
      style={{ backgroundImage: "url('/images/whitebackgroundlogin.png')" }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-[1280px] h-auto md:h-[720px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* BAGIAN KIRI */}
        <div
          className="relative w-full md:w-[50%] p-12 md:p-16 flex flex-col justify-center text-white bg-blue-600 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/bluebackgroundlogin.png')",
            backgroundColor: "#0647a6",
          }}
        >
          <div className="relative z-10 mt-10 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Protaseis
            </h1>
            <p className="text-sm md:text-base text-blue-100 mb-8 font-light tracking-wide">
              Create, Track, and Close — All in One Place.
            </p>
            <button className="px-8 py-2.5 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-full shadow-lg transition-colors duration-300">
              Read More
            </button>
          </div>
        </div>

        {/* BAGIAN KANAN */}
        <div className="w-full md:w-[50%] p-10 md:p-14 flex flex-col justify-center bg-white relative">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Hello Again!
              </h2>
              <p className="text-gray-500 text-sm">Welcome Back</p>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Input Password dengan Icon Mata */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 focus:outline-none"
                >
                  {showPassword ? (
                    // Icon Mata Terbuka
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    // Icon Mata Tertutup (Dicoret)
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.978 9.978 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-[#007aff] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-all text-sm"
              >
                Login
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-4 text-xs text-gray-400 font-medium">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="w-full flex justify-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log('Login Failed');
                  alert('Login Failed');
                }}
              />
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/register"
                className="text-sm text-[#007aff] hover:underline font-medium"
              >
                don't have an account ?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
