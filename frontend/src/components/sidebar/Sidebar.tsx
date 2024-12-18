import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { FaPlus, FaMinus, FaList, FaTheaterMasks } from 'react-icons/fa';
import { Trash3 } from 'react-bootstrap-icons';
import { HighlightOff } from '@mui/icons-material';
import { Modal, Button } from 'react-bootstrap';
import { LuPenSquare } from "react-icons/lu";
import { deleteConversation, deleteAllChats, startNewConversation, getCustomModels, createModel, deleteModel } from '../../api/axiosInstance';
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
  const [showModelModal, setShowModelModal] = useState<boolean>(false);
  const [showTrainingModal, setShowTrainingModal] = useState<boolean>(false);
  const [showDeleteModelModal, setShowDeleteModelModal] = useState<boolean>(false);
  const [deleteRoomId, setDeleteRoomId] = useState<string | null>(null);
  const [deleteModelId, setDeleteModelId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [models, setModels] = useState<CustomModel[]>([]);
  const [modelName, setModelName] = useState<string>('');
  const [systemContent, setSystemContent] = useState<string>('');
  const [userAssistantPairs, setUserAssistantPairs] = useState<{user: string, assistant: string}[]>([{ user: '', assistant: '' }]);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>('');
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

  const handleModelSelect = (modelId: string) => {
    onModelSelect(modelId);
    setShowModelModal(false);
  };

  const handleTrainModelClick = () => {
    setShowTrainingModal(true);
    setShowModelModal(false);
  };

  const handleAddPair = () => setUserAssistantPairs([...userAssistantPairs, { user: '', assistant: '' }]);

  const handleRemovePair = (index: number) => {
    setUserAssistantPairs(userAssistantPairs.filter((_, i) => i !== index));
  };

  const handlePairChange = (index: number, role: 'user' | 'assistant', value: string) => {
    const newPairs = [...userAssistantPairs];
    newPairs[index][role] = value;
    setUserAssistantPairs(newPairs);
  };

  const handleSubmit = async () => {
    setIsTraining(true);
    setResponseMessage('');
    try {
      const trainingData = userAssistantPairs.map(pair => JSON.stringify({
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: pair.user },
          { role: "assistant", content: pair.assistant }
        ]
      })).join('\n');

      await createModel(modelName, trainingData);
      setResponseMessage('Model created successfully');
      const updatedModels = await getCustomModels();
      setModels(updatedModels);
      await handleBacktoModels();
    } catch (error: any) {
      setResponseMessage(`Error creating model: ${error.response ? error.response.data.error : error.message}`);
    } finally {
      setIsTraining(false);
    }
  };

  const handleCloseTrainingModal = () => {
    setShowTrainingModal(false);
    setModelName('');
    setSystemContent('');
    setUserAssistantPairs([{ user: '', assistant: '' }]);
  };

  const handleBacktoModels = async () => {
    setShowTrainingModal(false);
    setModelName('');
    setSystemContent('');
    setUserAssistantPairs([{ user: '', assistant: '' }]);
    const updatedModels = await getCustomModels();
    setModels(updatedModels);
    setShowModelModal(true);
  };

  const handleDeleteModelClick = (modelId: string) => {
    setDeleteModelId(modelId);
    setShowDeleteModelModal(true);
    setShowModelModal(false);
  };

  const confirmDeleteModel = async () => {
    if (deleteModelId) {
      try {
        await deleteModel(deleteModelId);
        setShowDeleteModelModal(false);
        console.log('Model deleted successfully.');
      } catch (error) {
        console.log('Failed to delete model. Please try again.');
      }
    }
  };

  const cancelDeleteModel = () => {
    setShowDeleteModelModal(false);
    setShowModelModal(true);
  };

  const handleScenarioClick = () => {
    navigate('/scenarios');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <button className="new-conversation-button" onClick={startConversation}>
          <LuPenSquare size={31}/>
        </button>
      </div>
      <div className="sidebar-content">
        <button className="model-info" onClick={startConversation}>
          <img src={Nlogo_icon} alt="Nlogo" />
          <span>Branch-SPK</span>
        </button>
        <button className="new-model-icon" onClick={handleScenarioClick}>
          <FaTheaterMasks/>
          <span>시나리오</span>
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
                      <HighlightOff />
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
        <Modal.Header closeButton>
          <Modal.Title>대화 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 대화를 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>취소</Button>
          <Button variant="danger" onClick={confirmDelete}>삭제</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteAllModal} onHide={() => setShowDeleteAllModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>모든 대화 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 모든 대화를 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAllModal(false)}>취소</Button>
          <Button variant="danger" onClick={confirmDeleteAllChats}>삭제</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>오류</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error || '이미 새 대화가 생성되었습니다.'}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowErrorModal(false)}>닫기</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModelModal} onHide={() => setShowModelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>모델 목록</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="model-list">
            {models.map((model, index) => (
              <div key={index} className="model-item">
                <div className="model-item-content" onClick={() => handleModelSelect(model.modelId)}>
                  <div className="model-name">{model.modelName}</div>
                  <div className="model-date">{formatDate(model.createdAt)}</div>
                  <div className="model-id">{model.modelId}</div>
                </div>
                <button className="delete-button" onClick={() => handleDeleteModelClick(model.modelId)}>
                  <FaMinus size={16} />
                </button>
              </div>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleTrainModelClick}>
            <FaPlus size={25} />
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTrainingModal} onHide={handleCloseTrainingModal}>
        <Modal.Header closeButton>
          <Modal.Title>모델 생성</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-group">
            <label>모델 이름</label>
            <input
              type="text"
              placeholder="모델 이름을 입력하세요"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>모델 역할</label>
            <textarea
              rows={3}
              placeholder="모델의 성격, 임무, 역할 을 알려주세요."
              value={systemContent}
              onChange={(e) => setSystemContent(e.target.value)}
              required
            />
          </div>
          {userAssistantPairs.map((pair, index) => (
            <div key={index} className="input-group-pair">
              <div className="input-group-pair-header">
                <label>예시 질문 {index + 1}</label>
                {index > 0 && (
                  <Button variant="danger" onClick={() => handleRemovePair(index)}>
                    <FaMinus size={15}/>
                  </Button>
                )}
              </div>
              <div className="input-group">
                <textarea
                  rows={2}
                  placeholder="예시 질문을 입력하세요."
                  value={pair.user}
                  onChange={(e) => handlePairChange(index, 'user', e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label>원하는 응답 {index + 1}</label>
                <textarea
                  rows={2}
                  placeholder="원하는 응답 또는 대답을 알려주세요."
                  value={pair.assistant}
                  onChange={(e) => handlePairChange(index, 'assistant', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          {responseMessage && <p>{responseMessage}</p>}
          <Button variant="light" onClick={handleBacktoModels}>
            <FaList size={20} />
          </Button>
          <Button variant="light" onClick={handleAddPair}>
            <FaPlus size={20} />
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isTraining}>
            {isTraining ? '학습 중...' : '모델 생성'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModelModal} onHide={cancelDeleteModel}>
        <Modal.Header closeButton>
          <Modal.Title>모델 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 이 모델을 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteModel}>취소</Button>
          <Button variant="danger" onClick={confirmDeleteModel}>삭제</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default Sidebar;
