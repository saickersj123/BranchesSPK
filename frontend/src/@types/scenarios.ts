export interface AIScenario {
    game_id(_id: string, game_id: any, selectedRole: string, difficulty: number): unknown;
    _id: string; 
    name: string;
    description: string;
    imageUrl: string;
    difficulty: 1 | 2 | 3; 
    selected_game: { true: string, false: string }; 
    roles: { role1: string, role2: string };
  }
 