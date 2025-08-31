import React, { useState, useEffect, useRef } from "react";
import "./ChatScreen.css";

import ggumdolMain from "../assets/images/ggumdol_main.png";
import ggumdolImage from "../assets/images/ggumdol.png";
import sendIcon from "../assets/icons/send.svg";
import cameraIcon from "../assets/icons/camera.svg";
import scrollIcon from "../assets/icons/scroll.svg";
import locationCardIcon from "../assets/icons/location-card.svg";
import bellIcon from "../assets/icons/bell.svg";
import menuIcon from "../assets/icons/menu.svg";
import NotificationModal from "./NotificationModal";
import MenuModal from "./MenuModal";
import gptService from "../services/gptService";
import {
  getUnreadCount,
  initializeNotifications,
} from "../utils/notificationStorage";

interface ChatScreenProps {
  onClose: () => void;
  destination: string;
  userNickname?: string | null;
  onShowEnding?: (data: {
    uploadedImage?: string;
    visitedPlaces?: string[];
    userNickname?: string;
  }) => void;
}

const conversationScenarios = {
  "루미나셀이란건 무엇인가요?": {
    response:
      "루미나 셀은 빛 에너지를 저장하고 방출할 수 있는 혁신적인 기술이에요! 태양광보다 10배 더 효율적이고, 어둠 속에서도 빛을 낼 수 있어요. 하지만 아직 안정화되지 않아서 실험 중이에요.",
    followUpOptions: [
      "어떻게 작동하는 건가요?",
      "왜 안정화가 안 되나요?",
      "실험 기록을 찾아보겠습니다!",
    ],
  },
  "어떻게 작동하는 건가요?": {
    response:
      "루미나 셀은 특별한 광결정 구조를 가지고 있어요. 빛을 받으면 에너지를 저장하고, 필요할 때 다시 빛으로 변환해요. 마치 태양열 패널과 배터리를 합친 것 같죠!",
    followUpOptions: [
      "왜 안정화가 안 되나요?",
      "실험 기록을 찾아보겠습니다!",
      "다른 질문이 있어요",
    ],
  },
  "왜 안정화가 안 되나요?": {
    response:
      "아직 빛 에너지 변환 과정에서 열이 너무 많이 발생해요. 이 열이 셀을 손상시켜서 수명이 짧아져요. 온도 제어 기술이 핵심 과제예요!",
    followUpOptions: [
      "실험 기록을 찾아보겠습니다!",
      "다른 질문이 있어요",
      "꿈돌이와 더 대화하기",
    ],
  },
  "실험 기록이 어딨는지 같이 찾아봐요!": {
    response:
      "좋아요! 근처를 스캔하면 빛의 파형, 스펙트럼, 실패 이유 같은 정보가 나와요. 잘 분석해서 단서를 찾아야 해요!",
    followUpOptions: [
      "어떻게 스캔하나요?",
      "QR코드를 찾아보겠습니다!",
      "다른 방법이 있나요?",
    ],
  },
  "어떻게 스캔하나요?": {
    response:
      "카메라 버튼을 눌러서 주변을 촬영하면 자동으로 분석해요! 빛의 파장, 강도, 방향 등을 측정해서 실험 데이터와 비교할 수 있어요.",
    followUpOptions: [
      "QR코드를 찾아보겠습니다!",
      "지금 스캔해보겠습니다!",
      "다른 방법이 있나요?",
    ],
  },
  "QR코드를 찾아보겠습니다!": {
    response:
      "좋은 생각이에요! 곳곳에 흩어진 실험 기록 QR코드를 찾아주세요. 총 5개의 기록이 있어요. 각각 다른 실험 단계를 담고 있을 거예요!",
    followUpOptions: [
      "지금 스캔해보겠습니다!",
      "어디서 찾을 수 있나요?",
      "다른 방법이 있나요?",
    ],
  },
  "어디서 찾을 수 있나요?": {
    response:
      "박물관 내부의 주요 전시물 근처에 숨겨져 있어요. 특히 빛과 관련된 전시, 과학관, 그리고 실험실 복원 공간을 잘 살펴보세요!",
    followUpOptions: [
      "지금 스캔해보겠습니다!",
      "다른 방법이 있나요?",
      "꿈돌이와 더 대화하기",
    ],
  },
  "루미나 셀이 처음 실험된 장소는 어디인가요?": {
    response:
      "좋은 질문이에요! 루미나 셀의 첫 실험은 빛 에너지 연구실에서 시작됐어요.",
    followUpOptions: [
      "제가 뭘 하면 될까요?",
      "연구실이 어디에 있나요?",
      "다른 질문이 있어요",
    ],
  },
  "제가 뭘 하면 될까요?": {
    response:
      "곳곳에 흩어진 실험 기록 QR코드를 찾아주세요. 총 5개의 기록이 있어요",
    followUpOptions: [
      "QR코드를 찾아보겠습니다!",
      "어디서 찾을 수 있나요?",
      "지금 스캔해보겠습니다!",
    ],
  },
  "연구실이 어디에 있나요?": {
    response:
      "빛 에너지 연구실은 박물관 2층 서쪽 끝에 있어요. 지금은 복원 공간으로 운영되고 있지만, 원래 실험 장비들이 전시되어 있어요!",
    followUpOptions: [
      "제가 뭘 하면 될까요?",
      "QR코드를 찾아보겠습니다!",
      "지금 스캔해보겠습니다!",
    ],
  },
  "지금 스캔해보겠습니다!": {
    response:
      "좋아요! 카메라 버튼을 눌러서 주변을 촬영해보세요. 자동으로 빛 데이터를 분석하고 실험 기록과 비교할 거예요!",
    followUpOptions: [
      "스캔 완료! 결과를 확인해주세요",
      "다른 방법이 있나요?",
      "꿈돌이와 더 대화하기",
    ],
  },
  "스캔 완료! 결과를 확인해주세요": {
    response:
      "와! 흥미로운 데이터가 나왔네요! 빛의 파장이 예상과 다르게 나타나고 있어요. 이건 실험 기록과 일치하지 않아요. 뭔가 특별한 일이 일어나고 있는 것 같아요!",
    followUpOptions: [
      "무엇이 다른가요?",
      "다른 곳도 스캔해보겠습니다!",
      "QR코드를 더 찾아보겠습니다!",
    ],
  },
  "무엇이 다른가요?": {
    response:
      "정상적인 루미나 셀은 550nm 파장의 녹색 빛을 내야 하는데, 지금은 650nm의 붉은 빛이 감지되고 있어요. 이건 실험 기록에 없는 현상이에요!",
    followUpOptions: [
      "이게 무슨 의미인가요?",
      "다른 곳도 스캔해보겠습니다!",
      "QR코드를 더 찾아보겠습니다!",
    ],
  },
  "이게 무슨 의미인가요?": {
    response:
      "아마도 루미나 셀이 변이했거나, 다른 에너지원과 반응하고 있을 수도 있어요. 더 많은 데이터가 필요해요. 다른 곳도 스캔해보고 QR코드도 찾아봐요!",
    followUpOptions: [
      "다른 곳도 스캔해보겠습니다!",
      "QR코드를 더 찾아보겠습니다!",
      "꿈돌이와 더 대화하기",
    ],
  },
  "다른 방법이 있나요?": {
    response:
      "네! QR코드를 찾는 것 외에도, 박물관 직원들에게 물어보거나, 전시 설명을 자세히 읽어보는 방법도 있어요. 때로는 예상치 못한 곳에서 단서를 찾을 수 있어요!",
    followUpOptions: [
      "QR코드를 찾아보겠습니다!",
      "지금 스캔해보겠습니다!",
      "꿈돌이와 더 대화하기",
    ],
  },
  "다른 질문이 있어요": {
    response:
      "네! 루미나 셀에 대해 궁금한 게 있으면 언제든 물어보세요. 저는 이 실험을 도와주실 분을 기다리고 있었어요!",
    followUpOptions: [
      "루미나셀이란건 무엇인가요?",
      "실험 기록이 어딨는지 같이 찾아봐요!",
      "루미나 셀이 처음 실험된 장소는 어디인가요?",
    ],
  },
  "꿈돌이와 더 대화하기": {
    response:
      "좋아요! 저는 루미나 셀 실험을 성공시키는 것이 꿈이에요. 여러분의 도움이 정말 필요해요!",
    followUpOptions: [
      "루미나셀이란건 무엇인가요?",
      "실험 기록이 어딨는지 같이 찾아봐요!",
      "루미나 셀이 처음 실험된 장소는 어디인가요?",
    ],
  },
};

const ChatScreen: React.FC<ChatScreenProps> = ({
  destination,
  userNickname,
  onShowEnding,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [arMode, setArMode] = useState(false);
  const [scanData, setScanData] = useState({
    wavelength: 0,
    intensity: 0,
    temperature: 0,
  });
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [ggumdolImg, setGgumdolImg] = useState<HTMLImageElement | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // 응답 로딩 상태

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `${
        userNickname ? `${userNickname}님, ` : ""
      }정말로 와주셨군요! 도와주셔서 감사합니다.\n루미나 셀의 실험이 이곳에서 시작되었어요.\n이곳의 실험 기록에서 단서를 찾아야 해요!`,
      isUser: false,
      options: [
        "루미나셀이란건 무엇인가요?",
        "실험 기록이 어딨는지 같이 찾아봐요!",
        "루미나 셀이 처음 실험된 장소는 어디인가요?",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 카메라 스트림 정리
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // 꿈돌이 이미지 미리 로드 및 알림 초기화
  useEffect(() => {
    const img = new Image();
    img.src = ggumdolImage;
    img.onload = () => {
      setGgumdolImg(img);
    };

    // 알림 개수 초기화
    initializeNotifications();
    setUnreadNotificationCount(getUnreadCount());
  }, []);

  // AR 오버레이 렌더링
  useEffect(() => {
    if (isCameraOpen && arMode && arCanvasRef.current && videoRef.current) {
      const canvas = arCanvasRef.current;
      const ctx = canvas.getContext("2d");
      const video = videoRef.current;

      const renderAR = () => {
        // 비디오가 준비되지 않았으면 대기
        if (!video.videoWidth || !video.videoHeight) {
          requestAnimationFrame(renderAR);
          return;
        }

        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // AR 오버레이 그리기
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          const time = Date.now() * 0.001;

          // 1. 과학적 스캔 프레임 (더 정교한 디자인)
          const frameSize = Math.min(canvas.width, canvas.height) * 0.7;
          const frameX = centerX - frameSize / 2;
          const frameY = centerY - frameSize / 2;

          // 메인 스캔 프레임
          ctx.strokeStyle = "#4aabf8";
          ctx.lineWidth = 2;
          ctx.setLineDash([]);
          ctx.strokeRect(frameX, frameY, frameSize, frameSize);

          // 코너 장식 (과학적 느낌)
          const cornerSize = 20;
          ctx.strokeStyle = "#00ff88";
          ctx.lineWidth = 3;

          // 좌상단 코너
          ctx.beginPath();
          ctx.moveTo(frameX, frameY + cornerSize);
          ctx.lineTo(frameX, frameY);
          ctx.lineTo(frameX + cornerSize, frameY);
          ctx.stroke();

          // 우상단 코너
          ctx.beginPath();
          ctx.moveTo(frameX + frameSize - cornerSize, frameY);
          ctx.lineTo(frameX + frameSize, frameY);
          ctx.lineTo(frameX + frameSize, frameY + cornerSize);
          ctx.stroke();

          // 좌하단 코너
          ctx.beginPath();
          ctx.moveTo(frameX, frameY + frameSize - cornerSize);
          ctx.lineTo(frameX, frameY + frameSize);
          ctx.lineTo(frameX + cornerSize, frameY + frameSize);
          ctx.stroke();

          // 우하단 코너
          ctx.beginPath();
          ctx.moveTo(frameX + frameSize - cornerSize, frameY + frameSize);
          ctx.lineTo(frameX + frameSize, frameY + frameSize);
          ctx.lineTo(frameX + frameSize, frameY + frameSize - cornerSize);
          ctx.stroke();

          // 2. 스캔 라인 애니메이션 (더 과학적)
          const scanLineY = frameY + ((time * 60) % frameSize);
          ctx.strokeStyle = "#00ff88";
          ctx.lineWidth = 3;
          ctx.setLineDash([10, 5]);
          ctx.beginPath();
          ctx.moveTo(frameX, scanLineY);
          ctx.lineTo(frameX + frameSize, scanLineY);
          ctx.stroke();

          // 3. 스캔 파티클 효과
          for (let i = 0; i < 5; i++) {
            const particleX = frameX + Math.random() * frameSize;
            const particleY = frameY + Math.random() * frameSize;
            const size = 2 + Math.random() * 3;

            ctx.fillStyle = `rgba(0, 255, 136, ${
              0.3 + Math.sin(time * 2 + i) * 0.3
            })`;
            ctx.beginPath();
            ctx.arc(particleX, particleY, size, 0, Math.PI * 2);
            ctx.fill();
          }

          // 4. 꿈돌이 캐릭터 (우상단에 떠있는)
          const ggumdolSize = 80;
          const ggumdolX = canvas.width - ggumdolSize - 20;
          const ggumdolY = 20;

          // 꿈돌이 이미지 그리기
          if (ggumdolImg) {
            ctx.drawImage(
              ggumdolImg,
              ggumdolX,
              ggumdolY,
              ggumdolSize,
              ggumdolSize
            );
          }

          // 꿈돌이 말풍선
          const bubbleX = ggumdolX - 150;
          const bubbleY = ggumdolY + 20;
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.strokeStyle = "#4aabf8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.rect(bubbleX, bubbleY, 140, 60);
          ctx.fill();
          ctx.stroke();

          // 말풍선 화살표
          ctx.beginPath();
          ctx.moveTo(bubbleX + 140, bubbleY + 30);
          ctx.lineTo(ggumdolX, ggumdolY + 40);
          ctx.stroke();

          // 말풍선 텍스트
          ctx.fillStyle = "#000000";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText("스캔 중이에요!", bubbleX + 70, bubbleY + 35);
          ctx.fillText("잠시만요~", bubbleX + 70, bubbleY + 50);

          // 5. 과학적 데이터 패널 (좌상단)
          const panelX = 20;
          const panelY = 20;
          const panelWidth = 280;
          const panelHeight = 160;

          // 패널 배경
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
          ctx.strokeStyle = "#4aabf8";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.rect(panelX, panelY, panelWidth, panelHeight);
          ctx.fill();
          ctx.stroke();

          // 패널 제목
          ctx.fillStyle = "#4aabf8";
          ctx.font = "bold 16px Arial";
          ctx.textAlign = "left";
          ctx.fillText("루미나 셀 스캔 분석", panelX + 15, panelY + 25);

          // 데이터 표시
          ctx.fillStyle = "#ffffff";
          ctx.font = "14px 'Courier New', monospace";
          ctx.textAlign = "left";

          // 파장 데이터 (색상 변화)
          const wavelengthColor =
            scanData.wavelength < 550
              ? "#ff6b6b"
              : scanData.wavelength > 650
              ? "#ffa500"
              : "#00ff88";
          ctx.fillStyle = wavelengthColor;
          ctx.fillText(`λ: ${scanData.wavelength}nm`, panelX + 15, panelY + 45);

          // 강도 바 차트
          ctx.fillStyle = "#ffffff";
          ctx.fillText(
            `강도: ${scanData.intensity}%`,
            panelX + 15,
            panelY + 65
          );
          ctx.fillStyle = "#4aabf8";
          ctx.fillRect(
            panelX + 15,
            panelY + 70,
            (scanData.intensity / 100) * 100,
            8
          );
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.strokeRect(panelX + 15, panelY + 70, 100, 8);

          // 온도 데이터
          ctx.fillStyle = scanData.temperature > 30 ? "#ff6b6b" : "#00ff88";
          ctx.fillText(
            `온도: ${scanData.temperature}°C`,
            panelX + 15,
            panelY + 90
          );

          // 상태 표시
          ctx.fillStyle = "#00ff88";
          ctx.fillText("QR코드 탐지 중...", panelX + 15, panelY + 110);

          // 스캔 진행률
          const progress = (time * 20) % 100;
          ctx.fillStyle = "#ffffff";
          ctx.fillText(
            `진행률: ${Math.floor(progress)}%`,
            panelX + 15,
            panelY + 130
          );
          ctx.fillStyle = "#00ff88";
          ctx.fillRect(panelX + 15, panelY + 135, (progress / 100) * 100, 6);
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.strokeRect(panelX + 15, panelY + 135, 100, 6);

          // 6. 하단 가이드 텍스트
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 3;
          ctx.font = "bold 16px Arial";
          ctx.textAlign = "center";
          const guideText = "QR코드나 루미나 셀을 프레임 안에 맞춰주세요";
          ctx.strokeText(guideText, centerX, canvas.height - 40);
          ctx.fillText(guideText, centerX, canvas.height - 40);

          // 랜덤 데이터 업데이트 (시뮬레이션)
          setScanData({
            wavelength: Math.floor(500 + Math.random() * 200),
            intensity: Math.floor(20 + Math.random() * 80),
            temperature: Math.floor(20 + Math.random() * 15),
          });
        }
        requestAnimationFrame(renderAR);
      };

      renderAR();
    }
  }, [isCameraOpen, arMode, scanData]);

  const handleScrollClick = () => {
    setShowChatHistory(!showChatHistory);
  };

  const openCamera = async () => {
    try {
      // 로딩 상태 즉시 표시
      setIsCameraOpen(true);
      setIsVideoReady(false);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 30, max: 30 },
        }, // 후면 카메라 우선, 해상도 최적화
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // 비디오 로딩 타임아웃 설정 (5초)
        const timeoutId = setTimeout(() => {
          console.warn("비디오 로딩 타임아웃");
          setIsVideoReady(true); // 타임아웃 시에도 강제로 준비 상태로 변경
          setArMode(true); // AR 모드 활성화
        }, 5000);

        // 비디오 로딩 완료 후 AR 시작
        videoRef.current.onloadedmetadata = () => {
          clearTimeout(timeoutId);
          console.log(
            "비디오 로딩 완료:",
            videoRef.current?.videoWidth,
            "x",
            videoRef.current?.videoHeight
          );
          setIsVideoReady(true);
          setArMode(true); // AR 모드 활성화

          // 비디오 재생 시도
          if (videoRef.current) {
            videoRef.current.play().catch((e) => {
              console.error("비디오 재생 실패:", e);
              // 재생 실패해도 AR은 표시
              setIsVideoReady(true);
            });
          }
        };

        videoRef.current.oncanplay = () => {
          console.log("비디오 재생 준비 완료");
          setIsVideoReady(true);
          setArMode(true); // AR 모드 활성화
        };

        videoRef.current.onerror = (e) => {
          clearTimeout(timeoutId);
          console.error("비디오 에러:", e);
          setIsVideoReady(false);
          alert("카메라 영상을 불러오는데 실패했습니다. 다시 시도해주세요.");
        };
      }
    } catch (error) {
      console.error("카메라 접근 실패:", error);
      setIsCameraOpen(false);
      setIsVideoReady(false);

      // 더 구체적인 에러 메시지
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          alert(
            "카메라 접근이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요."
          );
        } else if (error.name === "NotFoundError") {
          alert(
            "카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요."
          );
        } else if (error.name === "NotReadableError") {
          alert(
            "카메라가 다른 앱에서 사용 중입니다. 다른 앱을 종료하고 다시 시도해주세요."
          );
        } else {
          alert(`카메라 접근에 실패했습니다: ${error.message}`);
        }
      } else {
        alert("카메라 접근에 실패했습니다. 브라우저 설정을 확인해주세요.");
      }
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
    setArMode(false);
    setIsVideoReady(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // AR 오버레이도 캡처에 포함
        if (arCanvasRef.current) {
          context.drawImage(arCanvasRef.current, 0, 0);
        }

        // 캡처된 이미지를 데이터 URL로 변환
        const capturedImageData = canvas.toDataURL("image/jpeg", 0.8);
        setUploadedImage(capturedImageData);

        // 사진 촬영 후 카메라 닫기
        closeCamera();

        // 스캔 완료 메시지 추가
        const userMessage = {
          id: messages.length + 1,
          text: "스캔 완료! 결과를 확인해주세요",
          isUser: true,
          options: [],
        };
        setMessages((prev) => [...prev, userMessage]);
        setShowChatHistory(true);

        // 꿈돌이의 응답과 선택지 추가
        setTimeout(() => {
          const response = {
            id: messages.length + 2,
            text: "고마워요 ! 덕분에 루미나셀의 모든 비밀을 풀 수 있었어요\n\n감사의 마음을 담은 선물을 받아주세요!",
            isUser: false,
            options: ["마지막으로 이동하기"],
          };
          setMessages((prev) => [...prev, response]);
        }, 1000);
      }
    }
  };

  const handleOptionClick = (option: string) => {
    // 옵션 클릭 시 채팅 기록 표시
    setShowChatHistory(true);

    // 사용자 메시지 추가
    const userMessage = {
      id: messages.length + 1,
      text: option,
      isUser: true,
      options: [],
    };
    setMessages((prev) => [...prev, userMessage]);

    // "마지막으로 이동하기" 선택지 처리
    if (option === "마지막으로 이동하기") {
      setTimeout(() => {
        if (onShowEnding) {
          onShowEnding({
            uploadedImage: uploadedImage || undefined,
            visitedPlaces: [destination],
            userNickname: userNickname || undefined,
          });
        }
      }, 500);
      return;
    }

    // 꿈돌이의 응답 추가
    setTimeout(() => {
      const scenario =
        conversationScenarios[option as keyof typeof conversationScenarios];
      if (scenario) {
        const response = {
          id: messages.length + 2,
          text: scenario.response,
          isUser: false,
          options: scenario.followUpOptions || [],
        };
        setMessages((prev) => [...prev, response]);
      } else {
        // 기본 응답
        const response = {
          id: messages.length + 2,
          text: "흥미로운 질문이에요! 더 자세히 설명해드릴게요.",
          isUser: false,
          options: [
            "루미나셀이란건 무엇인가요?",
            "실험 기록이 어딨는지 같이 찾아봐요!",
            "루미나 셀이 처음 실험된 장소는 어디인가요?",
          ],
        };
        setMessages((prev) => [...prev, response]);
      }
    }, 1000);
  };

  const getHardcodedResponse = () => {
    return {
      text: "흥미로운 이야기네요! 루미나 셀에 대해 더 궁금한 게 있으시면 언제든 물어보세요!",
      options: [
        "루미나셀이란건 무엇인가요?",
        "실험 기록이 어딨는지 같이 찾아봐요!",
        "루미나 셀이 처음 실험된 장소는 어디인가요?",
      ],
    };
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = inputValue;
      const newMessage = {
        id: messages.length + 1,
        text: userMessage,
        isUser: true,
        options: [],
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");

      setIsLoading(true);

      try {
        // 대화 기록 생성
        const conversationHistory =
          gptService.createConversationHistory(messages);

        // GPT API 호출 시도
        const gptResponse = await gptService.chat(
          userMessage,
          destination,
          conversationHistory
        );

        // GPT 응답이 성공적으로 온 경우
        const response = {
          id: messages.length + 2,
          text: gptResponse,
          isUser: false,
          options: [], // GPT 응답에는 옵션 버튼 제거
        };
        setMessages((prev) => [...prev, response]);
      } catch (error) {
        console.error("GPT 응답 실패, 하드코딩 응답 사용:", error);

        // GPT 실패 시 하드코딩된 응답 사용
        const hardcodedResponse = getHardcodedResponse();
        const response = {
          id: messages.length + 2,
          text: hardcodedResponse.text,
          isUser: false,
          options: hardcodedResponse.options,
        };
        setMessages((prev) => [...prev, response]);
      }

      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-screen">
      {/* 카메라 모달 */}
      {isCameraOpen && (
        <div className="camera-modal">
          <div className="camera-container">
            <div className="camera-header">
              <h3>루미나 셀 스캔</h3>
              <button onClick={closeCamera} className="close-camera-btn">
                ✕
              </button>
            </div>
            <div className="camera-video-container">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-video"
              />
              {!isVideoReady && (
                <div className="camera-loading">
                  <div className="loading-spinner"></div>
                  <p>카메라 로딩 중...</p>
                </div>
              )}
              <canvas
                ref={arCanvasRef}
                className="ar-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  opacity: isVideoReady ? 1 : 0,
                }}
              />
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="camera-controls">
              <button onClick={capturePhoto} className="capture-btn">
                스캔 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상단 헤더 */}
      <div className="chat-screen-header">
        <div className="chat-logo-text">
          <span className="chat-logo-blue">D</span>
          <span className="chat-logo-white">-CODE</span>
        </div>
        <div className="chat-header-icons">
          <button
            className="chat-icon-button"
            onClick={() => setShowNotificationModal(true)}
          >
            <img
              src={bellIcon}
              alt="알림"
              className="chat-icon"
            />
            {unreadNotificationCount > 0 && (
              <span className="chat-notification-badge">
                {unreadNotificationCount}
              </span>
            )}
          </button>
          <button
            className="chat-icon-button"
            onClick={() => setShowMenuModal(true)}
          >
            <img
              src={menuIcon}
              alt="메뉴"
              className="chat-icon"
            />
          </button>
        </div>
      </div>

      {/* 현재 위치 카드 */}
      <div className="chat-header">
        <div className="chat-current-location">
          <img
            src={locationCardIcon}
            alt="위치 카드"
            className="chat-location-card-bg"
          />
          <div className="chat-location-text">
            <div className="chat-location-label">현재장소</div>
            <div className="chat-location-name">{destination}</div>
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      {!showChatHistory && (
        <div className="ggumdol-character">
          <img src={ggumdolMain} alt="꿈돌이" />
        </div>
      )}
      {showChatHistory ? (
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.isUser ? "user-message" : "bot-message"
              }`}
            >
              <div className="message-bubble">
                <div className="message-text">{message.text}</div>
                {!message.isUser &&
                  message.options &&
                  message.options.length > 0 && (
                    <div className="message-options">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          className="option-button"
                          onClick={() => handleOptionClick(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="initial-message">
          <div className="speaker-label">꿈돌이</div>
          <div className="message-bubble">
            <div className="message-text">
              {userNickname ? `${userNickname}님, ` : ""}정말로 와주셨군요!
              도와주셔서 감사합니다.
              <br />
              루미나 셀의 실험이 이곳에서 시작되었어요.
              <br />
              이곳의 실험 기록에서 단서를 찾아야 해요!
            </div>
            <div className="message-options">
              <button
                className="option-button"
                onClick={() => handleOptionClick("루미나셀이란건 무엇인가요?")}
              >
                루미나셀이란건 무엇인가요?
              </button>
              <button
                className="option-button"
                onClick={() =>
                  handleOptionClick("실험 기록이 어딨는지 같이 찾아봐요!")
                }
              >
                실험 기록이 어딨는지 같이 찾아봐요!
              </button>
              <button
                className="option-button"
                onClick={() =>
                  handleOptionClick(
                    "루미나 셀이 처음 실험된 장소는 어디인가요?"
                  )
                }
              >
                루미나 셀이 처음 실험된 장소는 어디인가요?
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="chat-input-area">
        <div className="scroll-indicator">
          <div className="scroll-arrow" onClick={handleScrollClick}>
            <img src={scrollIcon} alt="스크롤" width="16" height="16" />
          </div>
        </div>
        <div className="input-container">
          <input
            type="text"
            className="chat-input"
            placeholder={
              isLoading
                ? "꿈돌이가 생각 중..."
                : "이곳을 눌러 대화를 시작하세요"
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <div className="input-buttons">
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              <img src={sendIcon} alt="전송" width="20" height="20" />
            </button>
            <button className="camera-button" onClick={openCamera}>
              <img src={cameraIcon} alt="카메라" width="20" height="20" />
            </button>
          </div>
        </div>
      </div>

      {/* 알림 모달 */}
      <NotificationModal
        visible={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onUnreadCountChange={setUnreadNotificationCount}
      />

      {/* 메뉴 모달 */}
      <MenuModal
        visible={showMenuModal}
        onClose={() => setShowMenuModal(false)}
      />
    </div>
  );
};

export default ChatScreen;
