import React from 'react';
import '../../css/levelProfilePage/GameHistoryModal.css';

interface GameHistory {
    gameName: string;
    participationTime: string;
    correctAnswers: number;
    experienceGained: number;
}

interface GameHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: GameHistory[];
}

const GameHistoryModal: React.FC<GameHistoryModalProps> = ({ isOpen, onClose, history }) => {
    if (!isOpen) return null;

    return (
        <div className="game-history-modal-overlay" onClick={onClose}>
            <div className="game-history-modal-content" onClick={e => e.stopPropagation()}>
                <div className="game-history-modal-header">
                    <h2>Game History</h2>
                    <button className="game-history-close-button" onClick={onClose}>&times;</button>
                </div>
                {history.length > 0 ? (
                    <div className="game-history-list">
                        {history.map((game, index) => (
                            <div key={index} className="game-history-item">
                                <div className="game-history-info">
                                    <h3>{game.gameName}</h3>
                                    <p className="game-history-date">
                                        {new Date(game.participationTime).toLocaleDateString('ko-KR', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="game-history-empty">
                        <div className="game-history-info">
                            <h3>No Game History Available</h3>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default GameHistoryModal;