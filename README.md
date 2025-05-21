# BranchesSPK - AI-Powered Voice Chatbot

BranchesSPK is an advanced AI-powered voice chatbot platform that offers multiple interaction modes and learning scenarios. The project combines modern web technologies with AI capabilities to create an engaging and educational conversational experience.

## Features

- **Multiple Chat Modes**:
  - Voice Chat: Real-time voice conversations with AI
  - Text Chat: Traditional text-based interactions
  - Scenario-based Chat: Structured learning scenarios

- **User Management**:
  - User authentication (login/signup)
  - Personal profile management
  - Progress tracking
  - Level-based profile system

- **Learning Scenarios**:
  - Curated conversation scenarios
  - Progress tracking
  - Interactive learning paths

## Tech Stack

### Frontend
- React with TypeScript
- Vite as build tool
- React Router for navigation
- Modern UI components

### Backend
- Node.js with TypeScript
- RESTful API architecture
- AI integration for natural language processing

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saickersj123/BranchesSPK.git
cd BranchesSPK
```

2. Install dependencies:
```bash
# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

3. Build the project:
```bash
# Build the client
npm run build-client
```

4. Start the application:
```bash
# Start the server
npm run start-server

# Start the client (in a new terminal)
npm run start-client
```

## Project Structure

```
BranchesSPK/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── api/       # API integration
│   │   └── utils/     # Utility functions
│   └── public/        # Static assets
│
├── backend/           # Node.js backend server
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/     # Data models
│   │   ├── routes/     # API routes
│   │   └── utils/      # Utility functions
│   └── Dataset/       # Training data and resources
│
└── package.json       # Project configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- theBranches Team

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the member of the Branches, Developer Club of AI Dept. SCNU