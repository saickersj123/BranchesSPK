export interface AIScenario {
    _id: string; 
    name: string;
    description: string;
    imageUrl: string;
    game_id: string;
    difficulty: 1 | 2 | 3;
    roles: {
      role1: string;
      role2: string;
    };
  }
 