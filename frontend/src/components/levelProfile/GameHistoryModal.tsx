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
    //console.log(history);
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
                                    <div className="game-history-stats">
                                        <div className="game-history-stat">
                                            <span className="game-history-label" data-type="answers">맞춘 정답의 수</span>
                                            <span className="game-history-value">{game.correctAnswers}</span>
                                        </div>
                                        <div className="game-history-stat">
                                            <span className="game-history-label" data-type="exp">얻은 경험치</span>
                                            <span className="game-history-value">+{game.experienceGained}</span>
                                        </div>
                                    </div>
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