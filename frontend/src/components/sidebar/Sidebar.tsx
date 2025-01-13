import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { FaTheaterMasks, FaMicrophone } from 'react-icons/fa';
import { Trash3 } from 'react-bootstrap-icons'; 
import { Modal, Button } from 'react-bootstrap';
import { LuSquarePlus, LuDelete } from "react-icons/lu";
import { deleteConversation, deleteAllChats, startNewConversation } from '../../api/AiTextChat'; 
import '../../css/Sidebar.css';
import Nlogo_icon from '../../img/Nlogo3.png';
import { useNavigate } from 'react-router-dom';

interface Conversation { _id: string; chats: any[]; createdAt: string; }
interface CustomModel { modelId: string; modelName: string; createdAt: string; }

interface SidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: (conversationId: string) => void;
  onConversationDelete: (resetChat: boolean) => void;
  onModelSelect: (modelId: string) => void;
}

const Sidebar = forwardRef<any, SidebarProps>(({
  isOpen, conversations, onConversationDelete, onNewConversation, onConversationSelect, onModelSelect
}, ref) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false); 
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null); 
  const [error, setError] = useState<string>(''); 
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({ startConversation }));

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

  const groupByDate = (rooms: Conversation[]) => {
    return rooms.reduce((groups: {[key: string]: Conversation[]}, room) => {
      const date = room.createdAt.split('T')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(room);
      return groups;
    }, {});
  };

  const handleDeleteClick = (roomId: string) => {
    setDeleteRoomId(roomId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteRoomId) {
      try {
        await deleteConversation(deleteRoomId);
        onConversationDelete(true);
        setShowDeleteModal(false);
        console.log('Conversation deleted successfully.');
      } catch (error) {
        console.log('Failed to delete conversation. Please try again.');
      }
    }
  };

  const handleDeleteAllChats = () => setShowDeleteAllModal(true);

  const confirmDeleteAllChats = async () => {
    try {
      await deleteAllChats();
      onConversationDelete(true);
      setShowDeleteAllModal(false);
    } catch (error) {
      console.log('Failed to delete all chats. Please try again.');
    }
  };

  const sortedChatRooms = useCallback(() => {
    const grouped = groupByDate(conversations);
    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => ({ date, rooms: grouped[date].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) }));
  }, [conversations]);

  const truncateMessage = (message: string, length: number) => {
    return message.length <= length ? message : message.substring(0, length) + '...';
  };

  useEffect(() => {
    sortedChatRooms().forEach(group => {
      group.rooms.forEach(room => {});
    });
  }, [conversations, sortedChatRooms]);

  const startConversation = async () => {
    try {
      const newConversationResponse = await startNewConversation();
      const newConversationId = newConversationResponse;
      if (newConversationId) {
        onNewConversation(newConversationId);
      } else {
        console.warn('No new conversation started.');
      }
    } catch (error: any) {
      setError(error.response?.data.cause || 'The last conversation is still empty. Please add messages before creating a new conversation.');
      setShowErrorModal(true);
    }
  };
 
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {/*
        <button className="new-conversation-button" onClick={startConversation}>
          <LuSquarePlus size={31}/>
        </button>
         */} 
      </div>
      <div className="sidebar-content">
        <button className="model-info" onClick={() => navigate('/textChat')}>
          <img src={Nlogo_icon} alt="Nlogo" />
          <span>채팅</span>
        </button>
        <button className="new-model-icon" onClick={() => navigate('/scenarios')}>
          <FaTheaterMasks/>
          <span>시나리오</span>
        </button>
        <button className="new-model-icon" onClick={() => navigate('/voiceChat')}>
          <FaMicrophone/>
          <span>음성대화 </span>
        </button>
        <div className="sidebar-menu">
          {conversations.length === 0 ? (
            <div className="no-chat-rooms">
              <p>대화 내역이 이곳에 저장됩니다.</p>
            </div>
          ) : (
            sortedChatRooms().map((group, index) => (
              <div key={index} className="chat-date-group">
                <h3 className="chat-date">{formatDate(group.date)}</h3>
                {group.rooms.map((room, idx) => (
                  <div key={idx} className="chat-room" onClick={() => onConversationSelect(room._id)}>
                    <span className="room-title">
                      {room.chats.length > 0 ? truncateMessage(room.chats[room.chats.length - 1].content, 40) : "새 대화를 시작하세요."}
                    </span>
                    <button className="one-delete-button" onClick={(e) => {e.stopPropagation(); handleDeleteClick(room._id); }}>
                      <LuDelete />
                    </button>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
        {conversations.length > 0 && (
          <button className="delete-all-button" onClick={handleDeleteAllChats}>
            <Trash3 />
          </button>
        )}
      </div>
      {/* Modals */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} className="Sidebar-Delete-Modal">
        <Modal.Header>
          <Modal.Title>대화 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 대화를 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>취소</Button>
          <Button variant="danger" onClick={confirmDelete}>삭제</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)}>
        <Modal.Header>
          <Modal.Title>모든 대화 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 모든 대화를 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>취소</Button>
          <Button variant="danger" onClick={confirmDeleteAllChats}>삭제</Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        backdrop="static"
        className="new-chat-error-modal"
        container={document.getElementById('.new-chat-error-modal-root')} // 특정 DOM 요소에 모달을 렌더링
      >
        <Modal.Header className='new-chat-error-modal-header'>
          <Modal.Title> 안내 </Modal.Title>
        </Modal.Header>
        <Modal.Body>{ '이미 새 대화가 생성되었습니다.'}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowErrorModal(false)}>닫기</Button>
        </Modal.Footer>
      </Modal>
  
    </div>
  );
});

export default Sidebar;
