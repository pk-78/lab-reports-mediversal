import React, { useEffect, useState } from "react";
import axios from "axios"; // Make sure axios is imported
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import url from "../auth/url"; // Ensure this URL is correct
import toast from "react-hot-toast";
// import { sendMMS } from "../services/kailya";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
  </svg>
);

const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState("uhid");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // useEffect(() => {sendMMS()})

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const checkSubmit = async (data) => {
    setLoading(true);

    try {
      const requestData =
        loginMethod === "uhid" ? { uhid: data.uhid } : { number: data.number };

      const response = await axios.post(
        `${url}/api/v1/auth/${
          loginMethod === "uhid" ? "sendwayOtpuhid" : "sendwayOtp"
        }`,
        requestData
      );

      console.log(response);

      if (response.status === 200) {
        // console.log("OTP sent successfully");
        toast.success("OTP sent successfully");
        navigate("/otp-verify", {
          state: {
            otpData: {
              number: data.number,
              responseData: response.data,
              method: loginMethod,
              uhid: data.uhid,
            },
          },
        });
        // console.log(response);
      } else {
        toast.error(response.response.error);
      }
    } catch (error) {
      console.log("Error sending OTP", error);
      toast.error(error.response.data.error);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 ">
      <div className=" w-full flex items-center justify-center p-4">
        <img
          src="../../MediversalDetailLogo.png"
          alt=""
          className="h-32 w-80"
        />
      </div>
      <div className=" w-full flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
          {/* Hero Section */}
          <div className="md:w-1/2 bg-teal-600 p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">
              Welcome to Mediversal Patient Portal
            </h2>
            <p className="mb-8 text-lg">
              Access your health information anytime, anywhere.
            </p>
            <ul className="space-y-4">
              {[
                "View and download lab reports",
                "Access diagnostic results",
                "Manage appointments",
                "View and pay bills securely",
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Login Form */}
          <div className="md:w-1/2 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-teal-800">
                Patient Portal
              </h3>
              <p className="text-teal-600">
                Enter your details to access your account
              </p>
            </div>

            {/* Modern Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-teal-100 rounded-full p-1">
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out ${
                    loginMethod === "uhid"
                      ? "bg-teal-500 text-white"
                      : "text-teal-800"
                  }`}
                  onClick={() => setLoginMethod("uhid")}
                >
                  UHID
                </button>
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ease-in-out ${
                    loginMethod === "mobile"
                      ? "bg-teal-500 text-white"
                      : "text-teal-800"
                  }`}
                  onClick={() => setLoginMethod("mobile")}
                >
                  Mobile
                </button>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(checkSubmit)}>
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1">
                  {loginMethod === "uhid" ? "UHID" : "Mobile Number"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-teal-500">
                    {loginMethod === "uhid" ? <UserIcon /> : <PhoneIcon />}
                  </div>
                  <input
                    type={loginMethod === "uhid" ? "text" : "tel"}
                    defaultValue={loginMethod === "uhid" ? "" : "+91"}
                    className="pl-10 block w-full border-teal-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                    placeholder={
                      loginMethod === "uhid"
                        ? "Enter your UHID"
                        : "Enter your mobile number"
                    }
                    {...register(loginMethod === "uhid" ? "uhid" : "number", {
                      required: "This field is required",
                      validate: (value) =>
                        loginMethod === "mobile"
                          ? value.startsWith("+91") ||
                            "Mobile number must start with +91"
                          : true,
                    })}
                    onInput={(e) => {
                      if (
                        loginMethod === "mobile" &&
                        !e.target.value.startsWith("+91")
                      ) {
                        e.target.value = "+91";
                      }
                    }}
                  />

                  {errors[loginMethod === "uhid" ? "uhid" : "number"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {
                        errors[loginMethod === "uhid" ? "uhid" : "number"]
                          ?.message
                      }
                    </p>
                  )}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      {" "}
                      <div className="dotLoader"></div>
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
