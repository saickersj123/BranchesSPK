import React from 'react'; 
import '../../css/voiceChat/VoiceChatHeader.css';  
import { useNavigate } from 'react-router-dom';
import UserSetDropdown from '../../components/userSetDropdown/UserSetDropdown';
import { deleteAllVoiceChats, deleteVoiceConversation, startNewConversationVoice } from '../../api/AiVoiceChat';
import { IoRefreshOutline } from 'react-icons/io5';

interface VoiceChatHeaderProps {
  children?: React.ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onReset: () => void;
}

const VoiceChatHeader: React.FC<VoiceChatHeaderProps> = ({ 
    children, 
    isSidebarOpen, 
    setIsSidebarOpen,
    onReset
}) => {
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await deleteAllVoiceChats();
      console.log('All voice chats deleted successfully.');

      // Start a new conversation after reset
      const newConversationId = await startNewConversationVoice();
      console.log('New conversation started with ID:', newConversationId);

      // Navigate to the new conversation
      navigate(`/voiceChat/${newConversationId}`, { replace: true });
    } catch (error) {
      console.error('Failed to reset and start a new conversation:', error);
    }
  };

  return (
    <>
      <div className={`voice-chat-header ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <span className="voice_chat_reset" onClick={onReset}>
          <IoRefreshOutline />
        </span>
        <div className="voice-chat-title-logo">
          <span className="brand-text" onClick={() => navigate('/voiceChat')}>Branch-SPK</span>
        </div>
        <UserSetDropdown currentPage="/voiceChat" />
      </div>
      <div className={`new-main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default VoiceChatHeader;