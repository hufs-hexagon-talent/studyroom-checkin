import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";

// room 조회
export const fetchRoom = async (roomId) => {
  const room_response = await apiClient.get(`/rooms/${roomId}`);
  return room_response.data.data;
};

export const useRooms = (roomIds) =>
  useQuery({
    queryKey: ["rooms", roomIds],
    queryFn: async () => {
      if (!roomIds || roomIds.length === 0) return [];
      const rooms = await Promise.all(
        roomIds.map((roomId) => fetchRoom(roomId))
      );
      return rooms;
    },
  });

// 모든 room 조회
export const fetchAllRooms = async () => {
  const all_rooms_response = await apiClient.get("/rooms");
  return all_rooms_response.data.data.rooms;
};

export const useAllRooms = () => {
  return useQuery({
    queryKey: ["allRooms"],
    queryFn: fetchAllRooms,
  });
};
