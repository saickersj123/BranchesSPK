import defaultBgImage from '../img/DUMMY_SCENARIOS/Study.png';
import companyinterview from '../img/DUMMY_SCENARIOS/CompanyInterview.png';
import cafe from '../img/DUMMY_SCENARIOS/Cafe.png';
import checkin from '../img/DUMMY_SCENARIOS/Hotel.png';
import cinema from '../img/DUMMY_SCENARIOS/Cinema.png';

import { AIScenario } from '../@types/scenarios';

export const DUMMY_SCENARIOS: AIScenario[] = [
    {
      _id: "1",
      name: "영어 회화 연습",
      description: "영어 회화를 연습하는 시나리오입니다.",
      imageUrl: defaultBgImage,
      difficulty: 1,
      game_id: '' 
    },
    {
      _id: "2", 
      name: "직장 면접", 
      description: "직장 면접 상황을 연습하는 시나리오입니다.",
      imageUrl: companyinterview,
      difficulty: 3,
      game_id: '' 
    },
    {
      _id: "3", 
      name: "카페 알바", 
      description: "카페 알바 상황을 연습하는 시나리오입니다.",
      imageUrl: cafe,
      difficulty: 1,
      game_id: '' 
    },
    {
      _id: "4", 
      name: "숙소 체크인", 
      description: "숙소 체크인 상황을 연습하는 시나리오입니다.",
      imageUrl: checkin,
      difficulty: 2,
      game_id: '' 
    },
    {
      _id: "5", 
      name: "영화 예매", 
      description: "영화 예매 상황을 연습하는 시나리오입니다.",
      imageUrl: cinema,
      difficulty: 1,
      game_id: '' 
    },
    {
      _id: "6",
      name: "유실물 센터", 
      description: "유실물 센터 상황을 연습하는 시나리오입니다.",
      imageUrl: null,
      difficulty: 2,
      game_id: '' 
    },
  ];
  