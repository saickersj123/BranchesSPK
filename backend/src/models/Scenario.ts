import mongoose from 'mongoose';

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
    model: {
      type: String,
      required: true,
    },
    fineTunedModels: [
      {
        modelId: { type: String, required: true },
        status: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 모델 중복 선언 방지
const Scenario = mongoose.models.Scenario || mongoose.model('Scenario', ScenarioSchema);

// 시나리오 데이터 정의
const scenarios = [
  {
    name: '영어 일상',
    description: '일상적인 영어 대화를 위한 모델.',
    roles: ['user', 'assistant'],
    difficulty: 1,
    model: 'base-model-id',
    fineTunedModels: [
      { modelId: 'ft:gpt-3.5-turbo-0125:sangjin-s-organization::Ar0YTId0', status: 'completed' },
    ],
  },
  {
    name: '인터뷰',
    description: '인터뷰 시나리오를 위한 모델.',
    roles: ['interviewer', 'interviewee'],
    difficulty: 1,
    model: 'base-model-id',
    fineTunedModels: [
      { modelId: 'ft:gpt-3.5-turbo-0125:sangjin-s-organization::AqyC9e6D', status: 'completed' },
    ],
  },
  {
    name: '영화 예매',
    description: '영화 예매 과정을 위한 모델.',
    roles: ['customer', 'system'],
    difficulty: 1,
    model: 'base-model-id',
    fineTunedModels: [
      { modelId: 'ft:gpt-3.5-turbo-0125:sangjin-s-organization::Aqguqfs4', status: 'completed' },
    ],
  },
  {
    name: '카페',
    description: '카페.',
    roles: ['customer', 'system'],
    difficulty: 1,
    model: 'base-model-id',
    fineTunedModels: [
      { modelId: 'ft:gpt-3.5-turbo-0125:sangjin-s-organization:cafe-order-final:At6pxHjC', status: 'completed' },
    ],
  },
  {
    name: '숙소 예약',
    description: '숙소 예약 과정을 위한 모델',
    roles: ['customer', 'system'],
    difficulty: 1,
    model: 'base-model-id',
    fineTunedModels: [
      { modelId: 'ft:gpt-3.5-turbo-0125:sangjin-s-organization:hotel:AsvChuhs', status: 'completed' },
    ],
  },
];

export default Scenario;
