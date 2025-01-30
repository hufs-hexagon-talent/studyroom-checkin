import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

// 체크인 하기
export const useCheckIn = () => {
  return useMutation({
    mutationFn: async ({ verificationCode, roomId }) => {
      const check_in_res = await apiClient.post("/check-in", {
        verificationCode,
        roomId,
      });
      return check_in_res.data;
    },
  });
};

// QR code 생성, OTP 제공
export const fetchOtp = async () => {
  const otp_response = await apiClient.post("/check-in/otp");
  console.log("otp_response.data.data.verificationCode", otp_response.data);
  return otp_response.data.data.verificationCode;
};

export const useOtp = () =>
  useQuery({
    queryKey: ["otp"],
    queryFn: () => fetchOtp(),
  });
