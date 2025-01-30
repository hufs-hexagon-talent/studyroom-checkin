import React, { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { addMinutes, format, parse } from "date-fns";

import useUrlQuery from "../../hooks/useUrlQuery";

import { ko } from "date-fns/locale";

import "react-datepicker/dist/react-datepicker.css";

import { useReservations } from "../../api/reservation.api";
import { fetchDate } from "../../api/policySchedule.api";

const createTimeTable = (config) => {
  const { startTime, endTime, intervalMinute } = config;
  const start = new Date();
  // 시작 시간에 맞게 지정
  start.setHours(startTime.hour, startTime.minute, 0, 0);

  const end = new Date();
  // 종료 시간에 맞게 지정
  end.setHours(endTime.hour, endTime.minute, 0, 0);

  const timeTable = [];

  // 시작시간으로 선언
  let currentTime = start;
  // 종료 시간이 될 떄 까지 intervalMinunte 간격으로 배열에 시간을 채워 넣음
  while (currentTime <= end) {
    timeTable.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, intervalMinute);
  }

  // 마지막 종료 시각을 채워 넣어야해서 배열의 length-1엔 endTime이 되게
  if (timeTable[timeTable.length - 1] !== format(end, "HH:mm")) {
    timeTable[timeTable.length - 1] = format(end, "HH:mm");
  }

  return timeTable;
};

const RoomPage = () => {
  const [availableDate, setAvailableDate] = useState([]);
  const [earliestStartTime, setEarliestStartTime] = useState(null);
  const [latestEndTime, setLatestEndTime] = useState(null);
  const [startHour, setStartHour] = useState(null);
  const [startMinute, setStartMinute] = useState(null);
  const [endHour, setEndHour] = useState(null);
  const [endMinute, setEndMinute] = useState(null);
  const [maxReservationMinute, setMaxReservationMinute] = useState(null);
  const departmentId = 1;
  const today = new Date();
  //const { departmentId: urlDepartmentId } = useParams();

  // const [departmentId, setDepartmentId] = useState(() => {
  //   if (urlDepartmentId) return Number(urlDepartmentId);
  //   return domain == 1;
  // });

  // domain에 따라 departmentId 설정
  // useEffect(() => {
  //   if (!urlDepartmentId) {
  //     setDepartmentId(domain === "ice" ? 2 : 1);
  //   }
  // }, [domain, urlDepartmentId]);

  const [selectedDate, setSelectedDate] = useUrlQuery(
    "date",
    format(new Date(), "yyyy-MM-dd"),
    departmentId
  );

  const { data: reservationsByRooms } = useReservations({
    date: selectedDate,
    departmentId: departmentId,
  });

  useEffect(() => {
    if (reservationsByRooms && reservationsByRooms.length > 0) {
      const startTimes = reservationsByRooms?.map(
        (room) => room.operationStartTime
      );
      // operationStartTime들에서 서로 비교해서 제일 작은 값이 earliest가 되게
      const earliestTime = startTimes.reduce((earliest, current) => {
        return earliest < current ? earliest : current;
      });
      setEarliestStartTime(earliestTime);

      // ':' 분리해서 시와 분으로 나눠서 저장
      const [startHour, startMinute] = earliestTime.split(":");
      setStartHour(parseInt(startHour, 10));
      setStartMinute(parseInt(startMinute, 10));

      const endTimes = reservationsByRooms?.map(
        (room) => room.operationEndTime
      );

      // operationEndTime들에서 서로 비교해서 제일 큰 값이 latest가 되게
      const latestTime = endTimes.reduce((latest, current) => {
        return latest > current ? latest : current;
      });
      setLatestEndTime(latestTime);

      // ':' 분리해서 시와 분으로 나눠서 저장
      const [endHour, endMinute] = latestTime.split(":");
      setEndHour(parseInt(endHour, 10));
      setEndMinute(parseInt(endMinute, 10));

      // eachMaxMinute들을 배열로 저장
      const eachMaxMinutes = reservationsByRooms?.map(
        (partition) => partition.eachMaxMinute
      );
      // 배열들 중에 가장 큰 값을 maxEachMaxMinute으로 저장
      const maxEachMaxMinute = Math.max(...eachMaxMinutes);
      setMaxReservationMinute(maxEachMaxMinute);
    }
  }, [reservationsByRooms, selectedDate]);

  // 계산해놓은 시간들을 timeTableConfig에 객체로 선언
  const timeTableConfig = {
    startTime: {
      hour: startHour,
      minute: startMinute,
    },
    endTime: {
      hour: endHour,
      minute: endMinute,
    },
    intervalMinute: 30,
    maxReservationMinute: maxReservationMinute,
  };

  const times =
    startHour !== null && startMinute !== null
      ? createTimeTable(timeTableConfig)
      : [];

  // date-picker에서 날짜 선택할 때마다 실행되는 함수
  const handleDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    // date picker에서 선택한 날짜 저장
    setSelectedDate(formattedDate);
  };

  // date-picker 설정
  registerLocale("ko", ko);

  // 현재로부터 예약 가능한 방들의 날짜 목록 가져오기
  useEffect(() => {
    const getDate = async (departmentId) => {
      const dates = await fetchDate(departmentId);
      setAvailableDate(dates);
    };
    getDate(departmentId);
  }, [departmentId]);

  return (
    <>
      <div id="container">
        <div id="head-container">
          <Typography
            paddingBottom={6}
            variant="h5"
            fontWeight={450}
            component="div"
            align="center"
          >
            일자별 세미나실 예약 현황
          </Typography>
          {/* date-picker 부분 */}
          <div className="flex justify-center">
            <div id="datepicker-container">
              <DatePicker
                id="date"
                className={"text-center flex"}
                selected={selectedDate}
                locale={ko}
                minDate={today}
                includeDates={availableDate}
                onChange={handleDateChange}
                dateFormat="yyyy년 MM월 dd일"
                showIcon
              />
            </div>
          </div>
        </div>

        <div id="squares" className="flex pl-4">
          <div
            className="w-6 h-6 mt-10"
            style={{ backgroundColor: "#F1EEE9" }}
          ></div>
          <div className="mt-10 ml-2">예약 가능</div>
          <div
            className="w-6 h-6 mt-10 ml-5"
            style={{ backgroundColor: "#7599BA" }}
          ></div>
          <div className="mt-10 ml-2">예약 선택</div>
          <div
            className="w-6 h-6 mt-10 ml-5"
            style={{ backgroundColor: "#002D56" }}
          ></div>
          <div className="mt-10 ml-2">예약 완료</div>
        </div>
        {/* timeTable 시작 */}
        <div>
          <TableContainer
            sx={{
              overflowX: "auto",
              width: "100%",
              marginTop: "20px",
              "@media (max-width : 1300px)": {
                overflowX: "scroll",
              },
              paddingLeft: "60px",
              marginBottom: "70px",
            }}
          >
            <Table>
              <TableHead
                className="fixedPartitions"
                sx={{
                  overflowX: "auto",
                  borderBottom: "none",
                }}
              >
                <TableRow>
                  <TableCell align="center" width={100} />
                  {times.map((time, timeIndex) => (
                    <TableCell
                      key={timeIndex}
                      align="center"
                      width={200}
                      className="fixedPartitions relative"
                      sx={{
                        borderRight: "none",
                        borderTop: "none",
                        borderBottom: "none",
                      }}
                    >
                      <div style={{ width: 20, height: 30 }}>
                        <span className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                          {time}
                        </span>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reservationsByRooms?.map((reservationsByRoom, i) => (
                  <TableRow key={i}>
                    <TableCell
                      sx={{
                        px: 2,
                        py: 2,
                        borderLeft: "1px solid #ccc",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {`${reservationsByRoom.roomName}-${reservationsByRoom.partitionNumber}`}
                    </TableCell>
                    {times.map((time, timeIndex) => {
                      if (timeIndex === times.length - 1) {
                        return null; // 마지막 열을 제외
                      }

                      const slotDateFrom = parse(
                        `${selectedDate} ${time}`,
                        "yyyy-MM-dd HH:mm",
                        new Date()
                      );
                      const slotDateFromPlus30 = addMinutes(slotDateFrom, 30);
                      const roomEndTime = reservationsByRoom.operationEndTime;
                      const isFuture =
                        format(slotDateFrom, "HH:mm") > roomEndTime &&
                        format(slotDateFrom, "HH:mm") <= latestEndTime;
                      const isPast = new Date() > slotDateFromPlus30;
                      const isReserved =
                        reservationsByRoom?.reservationTimeRanges.some(
                          (reservation) => {
                            const reservationStart = new Date(
                              reservation.startDateTime
                            );
                            const reservationEnd = new Date(
                              reservation.endDateTime
                            );
                            return (
                              slotDateFrom >= reservationStart &&
                              slotDateFrom < reservationEnd
                            );
                          }
                        );
                      const isSelectable = !isPast && !isReserved && !isFuture;
                      const mode = isReserved
                        ? "reserved"
                        : isPast
                          ? "past"
                          : isFuture
                            ? "future"
                            : "none";

                      return (
                        <TableCell
                          key={timeIndex}
                          style={{
                            backgroundColor: {
                              past: "#AAAAAA",
                              future: "#AAAAAA",
                              reserved: "#002D56",
                              none: "#F1EEE9",
                            }[mode],
                            borderRight: "1px solid #ccc",
                            borderLeft: "1px solid #ccc",
                            borderTop: "1px solid #ccc",
                            borderBottom: "1px solid #ccc",
                            cursor: isSelectable ? "pointer" : "not-allowed",
                          }}
                        ></TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default RoomPage;
