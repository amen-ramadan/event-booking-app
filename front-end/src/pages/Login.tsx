import { LOGIN } from "@/api/queries";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormFocused, setIsFormFocused] = useState(false);
  const [fieldFocus, setFieldFocus] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();

  const [login, { data, loading, error }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      console.log("Login successful:", data);
      // يمكنك إضافة navigation هنا
      navigate("/booking");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const handleSubmit = async () => {
    if (email && password && !loading) {
      try {
        await login({
          variables: {
            email: email.trim(),
            password,
          },
        });
      } catch (err) {
        // الخطأ سيتم التعامل معه في onError
        console.error("Login submission error:", err);
      }
    }
  };

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  const isFormValid = email.includes("@") && password.length >= 6;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 dark:from-rose-950 dark:via-pink-950 dark:to-rose-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 dark:border-rose-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-rose-600 dark:text-rose-400 font-medium">
            جاري تسجيل الدخول...
          </p>
        </div>
      </div>
    );
  }

  if (data) {
    console.log("Login data:", data.login.token);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 dark:from-rose-950 dark:via-pink-950 dark:to-rose-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-rose-200/30 to-pink-300/30 dark:from-rose-800/20 dark:to-pink-700/20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-rose-300/20 to-pink-200/20 dark:from-rose-700/15 dark:to-pink-800/15 animate-bounce"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-rose-200/10 to-pink-200/10 dark:from-rose-800/10 dark:to-pink-700/10 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
      </div>

      {/* بطاقة تسجيل الدخول */}
      <div
        className={`w-full max-w-md relative z-10 transform transition-all duration-500 ${
          isFormFocused ? "scale-105" : "scale-100"
        }`}
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-rose-200/50 dark:border-rose-800/50 p-8 space-y-6">
          {/* الشعار والعنوان */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700 rounded-2xl shadow-lg transform transition-transform hover:scale-110 duration-300">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
                مرحباً بك
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                سجل دخولك للمتابعة
              </p>
            </div>
          </div>

          {/* رسائل النجاح والخطأ */}
          {data && (
            <div className="flex items-center space-x-3 space-x-reverse bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 animate-in slide-in-from-top duration-300">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-green-800 dark:text-green-300 text-sm">
                تم تسجيل الدخول بنجاح!
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-3 space-x-reverse bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4 animate-in slide-in-from-top duration-300">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-300 text-sm">
                {error.message || "حدث خطأ أثناء تسجيل الدخول"}
              </p>
            </div>
          )}

          {/* حقول الإدخال */}
          <div className="space-y-6">
            {/* حقل البريد الإلكتروني */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail
                    className={`w-5 h-5 transition-colors duration-200 ${
                      fieldFocus.email
                        ? "text-rose-500 dark:text-rose-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => {
                    setFieldFocus((prev) => ({ ...prev, email: true }));
                    setIsFormFocused(true);
                  }}
                  onBlur={() => {
                    setFieldFocus((prev) => ({ ...prev, email: false }));
                    setIsFormFocused(false);
                  }}
                  onKeyPress={handleKeyPress}
                  className={`w-full pr-10 pl-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 ${
                    fieldFocus.email
                      ? "border-rose-400 dark:border-rose-500 ring-4 ring-rose-100 dark:ring-rose-900/50"
                      : "border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-600"
                  } focus:outline-none placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder="اكتب بريدك الإلكتروني"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* حقل كلمة المرور */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock
                    className={`w-5 h-5 transition-colors duration-200 ${
                      fieldFocus.password
                        ? "text-rose-500 dark:text-rose-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => {
                    setFieldFocus((prev) => ({ ...prev, password: true }));
                    setIsFormFocused(true);
                  }}
                  onBlur={() => {
                    setFieldFocus((prev) => ({ ...prev, password: false }));
                    setIsFormFocused(false);
                  }}
                  onKeyPress={handleKeyPress}
                  className={`w-full pr-10 pl-12 py-3 border-2 rounded-xl transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 ${
                    fieldFocus.password
                      ? "border-rose-400 dark:border-rose-500 ring-4 ring-rose-100 dark:ring-rose-900/50"
                      : "border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-600"
                  } focus:outline-none placeholder-gray-400 dark:placeholder-gray-500`}
                  placeholder="اكتب كلمة المرور"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200 disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || loading}
              className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 transform ${
                isFormValid && !loading
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700 hover:from-rose-600 hover:to-pink-700 dark:hover:from-rose-700 dark:hover:to-pink-800 hover:scale-105 shadow-lg hover:shadow-xl"
                  : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              } flex items-center justify-center space-x-2 space-x-reverse group`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>

          {/* رابط إنشاء حساب جديد */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              ليس لديك حساب؟{" "}
              <a
                href="/register"
                className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 font-medium transition-colors duration-200 hover:underline"
              >
                إنشاء حساب جديد
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
