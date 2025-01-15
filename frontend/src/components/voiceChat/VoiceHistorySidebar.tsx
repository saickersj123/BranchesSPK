// 여기에 사이드바 기능을 넣을 것
// 음성대화의 기록을 가지고 오는건데 디자인은 텍스트대화의 사이드바와 비슷하게
// 차이라면 여기는 음성대화의 기록을 가지고 오는 것이라는 것

import React, { useEffect, useState } from 'react';
import { fetchAllConversationIds } from '../../api/AiVoiceChat';
import ConversationItem from './ConversationItem';
import '../../css/voiceChat/VoiceHistorySidebar.css';

interface VoiceHistorySidebarProps {
  onConversationClick: (conversationId: string) => void;
  currentConversationId: string;
}

const VoiceHistorySidebar: React.FC<VoiceHistorySidebarProps> = ({ onConversationClick, currentConversationId }) => {
  const [conversationIds, setConversationIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchConversationIds = async () => {
      try {
        const ids = await fetchAllConversationIds();
        setConversationIds(ids);
      } catch (error) {
        console.error('대화 ID 가져오기 실패:', error);
      }
    };
    fetchConversationIds();
  }, []);

  return (
    <div className="voice-history-sidebar">
      <h2>Voice History</h2>
      <ul>
        {conversationIds.map((id) => (
          <ConversationItem 
            key={id} 
            id={id} 
            onClick={onConversationClick} 
            isActive={id === currentConversationId} 
          />
        ))}
      </ul>
    </div>
  );
};

export default VoiceHistorySidebar;
