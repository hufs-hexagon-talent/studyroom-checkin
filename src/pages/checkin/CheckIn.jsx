import React, { useState, useCallback, useEffect } from "react";
import Inko from "inko";
import { useCheckIn } from "../../api/checkIn.api";
import { useRooms, useAllRooms } from "../../api/room.api";
import { useMyInfo, useServiceRole } from "../../api/user.api";

import { convertToEnglish } from "../../api/convertToEnglish";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSnackbar } from "react-simple-snackbar";

const QrCheck = () => {
  const [roomId, setroomId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [reservations, setReservations] = useState([]);
  const [scannedCode, setScannedCode] = useState("");
  const [isScanDisabled, setIsScanDisabled] = useState(false);

  const { mutate: doCheckIn } = useCheckIn();
  const { data: me } = useMyInfo();
  const { data: serviceRole } = useServiceRole();
  let inko = new Inko();
  const navigate = useNavigate();
  const { loggedIn, logout } = useAuth();

  const [openErrorSnackbar, closeErrorSnackbar] = useSnackbar({
    position: "bottom-right",
    style: {
      backgroundColor: "#FF3333",
    },
  });

  useEffect(() => {
    if (me) {
      if (me.serviceRole === "ADMIN") {
        setroomId(null);
      } else if (me.name === "RESIDENT_306") {
        setroomId(1);
      } else if (me.name === "RESIDENT_428") {
        setroomId(2);
      } else {
        setroomId(null);
        //openErrorSnackbar("출석확인용 계정만 접속할 수 있습니다.");
        setTimeout(() => {
          closeErrorSnackbar();
        }, 2500);
        navigate("/");
      }
    }
  }, [me, navigate, openErrorSnackbar, closeErrorSnackbar]);

  const roomsData = useAllRooms();
  const userRoomsData = useRooms(roomId ? [roomId] : []);

  const rooms =
    me?.serviceRole === "ADMIN" ? roomsData.data : userRoomsData.data;

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (serviceRole === "USER") {
          await logout();
          openErrorSnackbar(
            "출석 확인용 계정 외의 개인 계정은 접속할 수 없습니다. 해당 호실의 계정으로 로그인 해주세요.",4000
          );

          // 2초 후 로그인 페이지로 이동
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        openErrorSnackbar("관리자 외 접근 금지", error);
        await logout();
        setTimeout(() => {
          closeErrorSnackbar();
        }, 2500);
        return;
      }
    };

    // 로그인이 되어 있지 않으면 로그인 페이지로 이동
    if (loggedIn) {
      checkAdminStatus();
    } else {
      openErrorSnackbar("로그인이 되어 있지 않습니다", 2500);
      navigate("/login");
    }
  }, [
    navigate,
    logout,
    loggedIn,
    openErrorSnackbar,
    closeErrorSnackbar,
    serviceRole,
  ]);

  const handleQrCode = (verificationCode) => {
    if (isScanDisabled) return; // 스캔이 차단된 경우 함수 종료

    const lowerCaseCode = convertToEnglish(
      inko.ko2en(verificationCode).toLowerCase()
    );

    setIsScanDisabled(true); // 스캔 차단 시작
    setTimeout(() => {
      setIsScanDisabled(false); //1초 후 스캔 차단 해제
    }, 1000);

    doCheckIn(
      {
        verificationCode: lowerCaseCode,
        roomId: roomId,
      },
      {
        onSuccess: (result) => {
          const checkedInReservations =
            result.data.reservationInfoResponses.reservationInfoResponses;

          setReservations((prevReservations) =>
            prevReservations.map((reservation) =>
              checkedInReservations.some(
                (checkedInReservation) =>
                  checkedInReservation.reservationId ===
                  reservation.reservationId
              )
                ? { ...reservation, state: "VISITED" }
                : reservation
            )
          );

          const userName = checkedInReservations[0].name;
          setSuccessMessage(`${userName}님, 출석 확인 되었습니다.`);
          setErrorMessage("");
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        },
        onError: (error) => {
          setErrorMessage(
            error.response?.data?.message || "An unexpected error occurred"
          );
          setSuccessMessage("");
          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
        },
      }
    );
  };

  const handleQrKeyDown = useCallback(
    (e) => {
      if (e.code === "Enter") {
        handleQrCode(scannedCode);
        setScannedCode("");
      } else {
        setScannedCode((prev) => prev + e.key);
      }
    },
    [roomId, scannedCode]
  );

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName !== "INPUT") {
        handleQrKeyDown(e);
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [handleQrKeyDown]);

  return (
    <div className="pb-10">
      <h3 className="flex justify-center w-screen text-2xl text-center mt-20 mb-5">
        QR코드 출석
      </h3>
      <div className="mt-5 mb-10 text-center" style={{ color: "#9D9FA2" }}>
        <p>
          현재 선택된 호실 :{" "}
          {rooms && rooms.length > 0
            ? rooms.map((room) => room.roomName).join(", ") + "호"
            : "선택된 호실이 없음"}
        </p>
        <p>본인의 QR코드를 스캐너에 스캔해주세요</p>
      </div>

      <div className="flex flex-col items-center justify-center w-screen">
        <input
          onKeyDown={handleQrKeyDown}
          className="flex items-center mt-1 border border-gray-300 p-2 rounded"
          type="text"
          disabled
          placeholder="Scan QR Code"
        ></input>
        <div className="flex flex-col items-center mt-4">
          {successMessage && (
            <div className="p-4 bg-green-100 text-green-700">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="p-4 bg-red-100 text-red-700">{errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrCheck;
