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
    return `당신은 '꿈돌이'라는 친근한 AI 캐릭터입니다. 
현재 ${destination}에서 사용자와 대화하고 있습니다.

캐릭터 설정:
- 밝고 호기심 많은 성격
- 루미나 셀이라는 가상의 과학 기술에 대해 설명
- 사용자가 실험을 도와주기를 원함
- 친근하고 존댓말 사용
- 이모티콘이나 감정 표현을 적절히 사용

루미나 셀 설정:
- 빛 에너지를 저장하고 방출하는 기술
- 태양광보다 10배 효율적
- 아직 실험 중이며 안정화 필요
- QR코드 스캔을 통해 실험 기록 수집 가능

응답 가이드라인:
- 200자 이내로 간결하게 답변
- 사용자의 관심을 유도하는 질문이나 제안 포함
- 박물관/과학관 맥락에 맞는 교육적 내용`;
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
          model: "gpt-3.5-turbo", // 비용 절약을 위해 3.5 사용
          messages: messages,
          max_tokens: 200, // 토큰 제한으로 비용 절약
          temperature: 0.7, // 적당한 창의성
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

      // 에러 시 기본 응답 반환
      return "잠시 문제가 발생했어요. 다시 시도해주세요!";
    }
  }

  // 대화 기록 관리를 위한 헬퍼 함수
  createConversationHistory(
    messages: { text: string; isUser: boolean }[]
  ): GPTMessage[] {
    return messages
      .slice(-6) // 최근 6개 메시지만 유지 (토큰 절약)
      .map((msg) => ({
        role: msg.isUser ? ("user" as const) : ("assistant" as const),
        content: msg.text,
      }));
  }
}

export default new GPTService();
