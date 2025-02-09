import mongoose from 'mongoose';
import { replacePlaceholders } from "../utils/replacePlaceholders.js";



const ScenarioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      required: true,
    },
    difficulty: {
      type: Number,
      required: true,
      min: 1,
      max: 3, // 난이도는 1~3 범위
    },
    fineTunedModel: {
      type: String,
      required: false,
      default: "default-model",
    },
    responseTemplate: {
      type: String,
      required: false,
      default: "Default response message.", // ✅ 기본 템플릿 추가
    },
    placeholders: {
      type: [String],
      required: false,
      default: [], // ✅ 기본값 [] 설정 (MongoDB에서 필드 누락 방지)
    },
  },
  {
    timestamps: true,
  }
);

// ✅ `getFormattedResponse` 수정 (특정 시나리오에서만 플레이스홀더 적용)
ScenarioSchema.methods.getFormattedResponse = function (userInput) {
  const template = this.responseTemplate;

  // 🔍 플레이스홀더가 있는 경우에만 `replacePlaceholders` 실행
  if (this.placeholders && this.placeholders.length > 0) {
    return replacePlaceholders(template, userInput);
  }

  // 🔹 플레이스홀더가 없으면 템플릿 그대로 반환
  return template;
};

// 모델 중복 선언 방지
const Scenario = mongoose.models.Scenario || mongoose.model('Scenario', ScenarioSchema);



// 시나리오 데이터 정의
const scenarios = [
  {
    name: '영어 일상',
    description: '일상적인 영어 대화를 위한 모델.',
    roles: ['user', 'assistant'],
    difficulty: 1,
    fineTunedModel: 'ft:gpt-3.5-turbo-0125:sangjin-s-organization::Ar0YTId0',
  },
  {
    name: '인터뷰',
    description: '인터뷰 시나리오를 위한 모델.',
    roles: ['interviewer', 'interviewee'],
    difficulty: 1,
    fineTunedModel: 'ft:gpt-3.5-turbo-0125:sangjin-s-organization::AqyC9e6D',
  },
  {
    name: '영화 예매',
    description: '영화 예매 과정을 위한 모델.',
    roles: ['customer', 'system'],
    difficulty: 1,
    fineTunedModel: 'ft:gpt-3.5-turbo-0125:sangjin-s-organization::Aqguqfs4',
  },
  {
    name: '카페',
    description: '카페.',
    roles: ['customer', 'system'],
    difficulty: 1,
    fineTunedModel: 'ft:gpt-3.5-turbo-0125:sangjin-s-organization:cafe-order-final:At6pxHjC',
  },
  {
    name: "호텔 예약",
    description: "호텔 체크인 시나리오",
    roles: ["user", "assistant"],
    difficulty: 1,
    fineTunedModel: "ft:gpt-3.5-turbo-0125:sangjin-s-organization:hotel:AsvChuhs",
    responseTemplate: "Hello, {NAME}. Your booking is for {X} nights. Your check-in is at {Y}PM. You will be staying in room {Room_number}.",
    placeholders: ["{NAME}", "{X}", "{Y}", "{Room_number}"]
  }

];

export default Scenario;
