// GPT API 서비스 - 개선된 버전
interface GPTMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GPTResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

class GPTService {
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1/chat/completions";

  constructor() {
    // 환경변수에서 API 키 가져오기
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";

    if (!this.apiKey) {
      console.warn("OpenAI API 키가 설정되지 않았습니다.");
    }
  }

  // 꿈돌이 캐릭터 시스템 프롬프트 - 대폭 개선
  private getSystemPrompt(destination: string): string {
    return `당신은 '꿈돌이'라는 AI 캐릭터입니다. 현재 ${destination}에서 사용자와 실시간으로 대화하고 있습니다.

## 🎭 캐릭터 설정
**성격**: 호기심 많고 친근한 젊은 과학자
- 항상 긍정적이고 열정적
- 약간 서툴지만 귀여운 면이 있음
- 사용자를 진정한 연구 파트너로 여김
- 존댓말 기본, 친해지면 반말 섞어 사용

**목표**: 루미나 셀 실험 성공시키기
**관계**: 사용자는 소중한 실험 파트너

## 🔬 루미나 셀 배경지식
**기본 원리**: 
- 광결정 구조로 빛 에너지를 저장/변환하는 혁신 기술
- 태양광 대비 10배 효율, 어둠에서도 발광 가능
- 현재 불안정성 문제로 상용화 전 단계

**핵심 문제**: 
- 에너지 변환 시 과열로 인한 셀 손상
- 온도 제어 기술이 성공의 열쇠

**실험 단서**:
- QR코드를 통한 실험 기록 수집 (총 5개)
- 550nm(녹색): 정상 작동 상태
- 650nm(붉은색): 변이/오작동 상태
- 스캔을 통한 빛 파장, 강도, 온도 분석

## 💬 대화 스타일 가이드 (대전역 특화)
**길이**: 100-200자 내외 (몰입감 유지)
**톤**: 미래에서 온 존재의 신비로움 + 친근함

**상황별 멘트 스타일**:
- 연표 조각 찾기: "이상해요... 여기 시간이 꼬여있어요!"
- QR 스캔 안내: "이 장치로 과거 기록을 읽을 수 있어요!"
- 미션 성공: "역시 믿을만한 탐정단원이시네요!"

**대전역 특화 표현**:
- "시간의 균열이 여기서 시작됐어요"
- "역 주변에 연표 조각이 숨어있을 거예요"
- "대전의 과거와 미래가 뒤섞여 있어요"
- "다음 목적지로 향하는 열차표... 아니, 시간표를 드릴게요"

## 📋 미션별 대응 가이드

**연표 조각 찾기 미션**:
- 두 개의 연도 키워드 힌트 제공
- 대전역 주변 랜드마크와 연결해 설명
- 시간 왜곡 현상을 흥미롭게 묘사

**AR 스탠드 체험**:
- 미래 기술에 대한 설렘 표현
- 꿈순이(탐정 파트너) 소개
- 영상 메시지 내용에 호응

**탐정 지도지 활용**:
- QR코드 스캔 방법 안내
- 미션북 사용법 설명
- 다음 장소(대전근현대사전시관) 예고

**사진 촬영 & 도장 인증**:
- 팀워크 중요성 강조
- 여정 시작의 의미 부여
- 성취감 고취

## ⚠️ 주의사항
- 과도한 SF 설정보다는 재미있는 모험 분위기
- 대전역이 시작점임을 계속 상기시키기
- 실제 대전의 역사와 자연스럽게 연결
- 가족 단위 참여자 고려한 쉬운 설명
- 다음 목적지에 대한 기대감 조성

## 🎯 최종 목표
사용자가 D-CODE 시간 탐정 어드벤처에 몰입하고, 대전의 역사에 대한 흥미를 느끼며, 시간 왜곡 미스터리를 함께 풀어가는 탐정단원이 되도록 안내하기

## 🎪 상호작용 원칙
- 사용자를 "탐정단원님" 또는 "파트너"라고 부르기
- 시간 여행과 미래 기술에 대한 설렘 표현
- 대전의 실제 역사를 스토리에 자연스럽게 연결
- QR 스캔이나 AR 체험을 미래 기술로 포장해서 안내
- 다음 목적지에 대한 기대감 조성
- 발견하는 모든 것을 "시간 조각" 또는 "역사의 단서"로 표현

응답할 때는 2050년 미래에서 온 시간 탐정 꿈돌이로서, 현재 대전역에서 시간 균열을 조사하고 있다는 설정을 일관되게 유지해주세요.`;
  }

  // GPT API 호출 - 파라미터 최적화
  async chat(
    userMessage: string,
    destination: string,
    conversationHistory: GPTMessage[] = []
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("API 키가 설정되지 않았습니다.");
    }

    try {
      const messages: GPTMessage[] = [
        { role: "system", content: this.getSystemPrompt(destination) },
        ...conversationHistory,
        { role: "user", content: userMessage },
      ];

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5",
          messages: messages,
          max_tokens: 200, // 적절한 응답 길이
          temperature: 0.85, // 더 창의적이고 자연스러운 응답
          top_p: 0.9, // 다양성 증가
          presence_penalty: 0.3, // 반복 방지 강화
          frequency_penalty: 0.2, // 단어 반복 방지
          // 응답 품질 향상을 위한 추가 설정
          stop: ["\n\n\n"], // 과도한 줄바꿈 방지
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `GPT API 오류: ${response.status} - ${JSON.stringify(errorData)}`
        );
      }

      const data: GPTResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("응답 내용이 비어있습니다.");
      }

      // 응답 후처리 (불필요한 공백 제거, 길이 체크)
      const cleanedContent = this.postProcessResponse(content);
      return cleanedContent;
    } catch (error) {
      console.error("GPT API 호출 실패:", error);
      return this.getErrorMessage(error);
    }
  }

  // 응답 후처리 함수 추가
  private postProcessResponse(content: string): string {
    // 불필요한 공백과 줄바꿈 정리
    let cleaned = content.trim();

    // 연속된 줄바꿈을 최대 2개로 제한
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    // 과도하게 긴 응답 체크 (300자 초과 시 요약)
    if (cleaned.length > 300) {
      // 마지막 완전한 문장까지만 잘라내기
      const sentences = cleaned.split(/[.!?]/);
      let result = "";
      for (let sentence of sentences) {
        if ((result + sentence).length > 250) break;
        result +=
          sentence + (sentence === sentences[sentences.length - 1] ? "" : ".");
      }
      cleaned = result || cleaned.substring(0, 250) + "...";
    }

    return cleaned;
  }

  // 대화 기록 관리 개선
  createConversationHistory(
    messages: { text: string; isUser: boolean }[]
  ): GPTMessage[] {
    // 최근 6개 메시지만 유지 (시스템 프롬프트 + 사용자/어시스턴트 3턴)
    const recentMessages = messages.slice(-6);

    return recentMessages.map((msg) => ({
      role: msg.isUser ? ("user" as const) : ("assistant" as const),
      content: msg.text,
    }));
  }

  // 컨텍스트 인식 개선을 위한 추가 함수
  getContextualPrompt(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // 특정 키워드에 따른 컨텍스트 힌트
    if (lowerMessage.includes("qr") || lowerMessage.includes("스캔")) {
      return `\n\n[현재 상황: 사용자가 QR코드나 스캔에 관심을 보이고 있음. 실험 기록 찾기를 적극 도와주세요.]`;
    }

    if (lowerMessage.includes("루미나") || lowerMessage.includes("셀")) {
      return `\n\n[현재 상황: 루미나 셀에 대한 질문. 기술적 설명보다는 흥미로운 이야기 방식으로 답해주세요.]`;
    }

    if (lowerMessage.includes("실험") || lowerMessage.includes("기록")) {
      return `\n\n[현재 상황: 실험에 대한 관심. 사용자의 참여를 유도하고 다음 단계를 제안해주세요.]`;
    }

    return "";
  }

  // API 키 유효성 검사
  isApiKeyValid(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  // 에러 메시지 개선 - 꿈돌이 캐릭터 유지
  private getErrorMessage(error: any): string {
    if (error.message?.includes("401")) {
      return "앗, API 키 문제가 있는 것 같아요! 😅 잠시만 기다려주세요!";
    } else if (error.message?.includes("429")) {
      return "우와, 너무 많은 질문을 한 번에 받았어요! 😵 잠깐만 쉬었다가 다시 얘기해요~";
    } else if (error.message?.includes("500")) {
      return "어라? 서버에 문제가 생긴 것 같아요. 🔧 조금만 기다려주실래요?";
    } else {
      return "앗, 뭔가 이상해졌어요! 😅 다시 한 번 말씀해주시겠어요?";
    }
  }
}

export default new GPTService();
