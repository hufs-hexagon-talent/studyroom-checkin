import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

// 관리자인지 아닌지
export const fetchServiceRole = async () => {
  try {
    const isAdmin_res = await apiClient.get("/users/me");
    return isAdmin_res.data.data.serviceRole;
  } catch (e) {
    return false;
  }
};

export const useServiceRole = () => {
  return useQuery({
    queryKey: ["serviceRole"],
    queryFn: fetchServiceRole,
  });
};

// 자신의 정보 조회
const fetchMyInfo = async () => {
  try {
    const myInfo_res = await apiClient.get("/users/me");
    return myInfo_res.data.data;
  } catch (e) {
    return false;
  }
};

export const useMyInfo = () => {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: fetchMyInfo,
  });
};
