export interface ServiceOption {
    id: string;
    title: string;
    description: string; 
  }
  
  export const serviceOptions: ServiceOption[] = [
    {
      id: 'voice',
      title: '음성 대화',
      description: '자연스러운 음성 대화를 나눠보세요', 
    },
    {
      id: 'text',
      title: '채팅',
      description: '텍스트로 대화를 나눠보세요', 
    },
    {
      id: 'scenario',
      title: '시나리오',
      description: '시나리오를 즐겨보세요', 
    }
  ];