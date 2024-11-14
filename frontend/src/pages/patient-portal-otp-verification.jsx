import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import url from "../auth/url";
import toast from "react-hot-toast";

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const { otpData } = location.state || {};

  useEffect(() => {
    // console.log("number:", otpData?.number);
    // console.log("response Data:", otpData?.responseData.otp);
    // console.log("response Data:", otpData?.responseData?.number);
    // console.log("method", otpData?.method);
    // console.log("uhid", otpData?.uhid);
    // console.log(
    //   `${otpData?.method === "uhid" ? "verify-otp-uhid" : "verify-otp"}`
    // );
  }, [otpData]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(countdown);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleResendOTP = () => {
    // Logic to resend OTP goes here
    setTimer(30);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const otpString = otp.join("");
    // console.log("Submitted OTP:", otpString);
    // console.log("Associated Number:", otpData?.number);

    try {
      const response = await axios.post(
        `${url}/api/v1/auth/${
          otpData?.method === "uhid" ? "verify-otp-uhid" : "verify-otp"
        }`,
        {
          otp: otpString,
          number: otpData?.responseData?.number,
          UHID: otpData?.uhid,
        }
      );

      // console.log("Verification Response:", response);

      if (response.status === 200) {
        toast.success("Verified");
        // console.log(response);
        if (otpData?.method === "uhid") {
          // console.log("ye le", response.data);
          navigate(`/dashboard/${response.data.id}`);
        } else {
          if (
            response.data.uhidList.length === 1 ||
            otpData?.method === "uhid"
          ) {
            navigate(`/dashboard/${response.data.uhidList[0]?._id}`); 
          } else if (otpData?.method === "uhid") {
            const matchingItem = uhidList.find(
              (item) => item.UHID === otpData?.uhid
            );

            // const matchingId = matchingItem?._id;

            navigate(`/dashboard/${matchingItem?._id}`); 
          } else if (response.data.uhidList.length > 1) {
            navigate("/post-uhid-selection", {
              state: {
                uhidList: response.data.uhidList,
                number: otpData?.number, 
              },
            });
          }
        }
      } else {
        console.error("Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      
      if (error.response) {
      
        console.error("Server Error:", error.response.data.message);
        toast.error(error.response.data.message);
      } else {
       
        console.error("Network Error:", error.message);
        toast.error("Network Error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-teal-800">Verify OTP</h3>
          <p className="text-teal-600">
            Enter the OTP sent to {otpData?.responseData?.number}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => {
              return (
                <input
                  className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 text-teal-800"
                  type="text"
                  name="otp"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                />
              );
            })}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 ease-in-out"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendOTP}
            disabled={timer > 0}
            className={`text-sm ${
              timer > 0 ? "text-teal-400" : "text-teal-600 hover:text-teal-800"
            } font-medium`}
          >
            Resend OTP {timer > 0 ? `in ${timer} seconds` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
