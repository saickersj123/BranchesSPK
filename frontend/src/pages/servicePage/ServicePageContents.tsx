import React, { useState } from 'react';
import ServiceModal from '../../components/servicePage/SeiviceModal';
import { useNavigate } from 'react-router-dom';
import '../../css/servicePage/ServicePageContents.css';


const ServicePageContents = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div> 
            <h1>로그인 후 연결되는 페이지</h1> 
            <div className="service-main-page-start-button">
            <button className="service-main-start-button" onClick={() => navigate('/voiceChat')}>Start</button>
            </div>
    
            <div className="service-main-page-mode-button">
            <button className="service-main-start-button" onClick={openModal}>Start</button>
            </div>
            
            <ServiceModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

export default ServicePageContents;