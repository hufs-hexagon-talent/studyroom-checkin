import { useMutation } from "@tanstack/react-query";
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
