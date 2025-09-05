// GPT API 서비스
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

  // 꿈돌이 캐릭터 시스템 프롬프트
  private getSystemPrompt(destination: string): string {
    return `당신은 '꿈돌이'라는 친근하고 호기심 많은 AI 캐릭터입니다. 
현재 ${destination}에서 사용자와 대화하고 있습니다.

캐릭터 설정:
- 밝고 활발한 성격, 항상 긍정적
- 루미나 셀 실험을 성공시키고 싶어함
- 사용자를 실험 파트너로 생각하고 신뢰함
- 친근하고 존댓말 사용, 때로는 반말도 섞어서 사용
- 과학에 대한 열정이 넘침

루미나 셀 설정:
- 빛 에너지를 저장하고 방출하는 혁신적인 기술
- 태양광보다 10배 효율적이지만 아직 불안정
- 온도 제어가 핵심 과제 (열로 인한 셀 손상 문제)
- QR코드 스캔을 통해 실험 기록 수집 가능
- 550nm 녹색 빛이 정상, 650nm 붉은 빛은 변이 현상

대화 스타일:
- 150-250자 내외로 답변
- 사용자의 질문에 직접적이고 친근하게 응답
- 과학적 내용을 쉽고 재미있게 설명
- 다음 행동을 유도하는 질문이나 제안 포함
- 박물관/과학관 맥락에 맞는 교육적 내용
- 때로는 꿈돌이의 개성(호기심, 열정, 약간의 서툴러움) 드러내기

금지사항:
- 너무 길거나 복잡한 설명 금지
- 딱딱한 과학 용어 남발 금지
- 부정적이거나 절망적인 표현 금지`;
  }

  // GPT API 호출
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
          model: "gpt-4o-mini", // 더 나은 성능을 위해 4o-mini 사용
          messages: messages,
          max_tokens: 300, // 적절한 응답 길이
          temperature: 0.8, // 창의적이고 친근한 응답
          presence_penalty: 0.1, // 반복 방지
          frequency_penalty: 0.1, // 다양성 증가
        }),
      });

      if (!response.ok) {
        throw new Error(`GPT API 오류: ${response.status}`);
      }

      const data: GPTResponse = await response.json();
      return (
        data.choices[0]?.message?.content ||
        "죄송해요, 응답을 생성할 수 없어요."
      );
    } catch (error) {
      console.error("GPT API 호출 실패:", error);

      // 에러 시 개선된 메시지 반환
      return this.getErrorMessage(error);
    }
  }

  // 대화 기록 관리를 위한 헬퍼 함수
  createConversationHistory(
    messages: { text: string; isUser: boolean }[]
  ): GPTMessage[] {
    return messages
      .slice(-8) // 최근 8개 메시지 유지 (더 나은 맥락)
      .map((msg) => ({
        role: msg.isUser ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));
  }

  // API 키 유효성 검사
  isApiKeyValid(): boolean {
    return !!this.apiKey && this.apiKey.length > 0;
  }

  // 에러 메시지 개선
  private getErrorMessage(error: any): string {
    if (error.message?.includes("401")) {
      return "API 키가 유효하지 않아요. 설정을 확인해주세요! 🔑";
    } else if (error.message?.includes("429")) {
      return "잠시 너무 많은 요청을 보냈어요. 조금 기다렸다가 다시 시도해주세요! ⏰";
    } else if (error.message?.includes("500")) {
      return "서버에 문제가 생겼어요. 잠시 후 다시 시도해주세요! 🔧";
    } else {
      return "앗, 뭔가 문제가 생겼어요! 다시 시도해주세요! 😅";
    }
  }
}

export default new GPTService();
