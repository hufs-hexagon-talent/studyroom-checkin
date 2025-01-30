import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

// 특정 날짜, 특정 부서가 관리하는 모든 파티션의 예약 상태 조회
export const fetchReservations = async ({ date, departmentId }) => {
  const response = await apiClient.get(
    `/reservations/by-date/${departmentId}?date=${date}`
  );

  const data = response.data.data.partitionReservationInfos;

  return data;
};

export const useReservations = ({ date, departmentId }) =>
  useQuery({
    queryKey: ["reservationsByRooms", date, departmentId],
    queryFn: () => fetchReservations({ date, departmentId }),
    enabled: !!departmentId,
  });
