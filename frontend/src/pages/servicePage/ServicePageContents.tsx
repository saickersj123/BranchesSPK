import React, { useState } from 'react';
import ServiceModal from '../../components/servicePage/SeiviceModal';
import { useNavigate } from 'react-router-dom';
import '../../css/servicePage/ServicePageContents.css';
import { set_routes } from '../../Routes';

const ServicePageContents = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div> 
            <h1>로그인 후 연결되는 페이지</h1> 
            <div className="service-main-page-start-button">
            <button className="service-main-start-button" onClick={() => navigate(set_routes.VOICE_CHAT)}>시작</button>
            </div>
    
            <div className="service-main-page-mode-button">
            <button className="service-main-start-button" onClick={openModal}>옵션</button>
            </div>
            
            <ServiceModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default ServicePageContents;