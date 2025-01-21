import React, { useEffect, useState } from 'react';
import { gethUserExperience, getUserName, getPastGames } from '../../api/UserInfo';
import '../../css/levelProfilePage/MyEx.css';
import LevelIcon from '../../utils/LevelIcon';
import GameHistoryModal from './GameHistoryModal';

interface GameHistory {
    gameName: string;
    participationTime: string;
    correctAnswers: number;
    experienceGained: number;
}

const MyEx: React.FC = () => {
    const [experience, setExperience] = useState<number | null>(null);
    const [level, setLevel] = useState<number | null>(null);
    const [completedCourses, setCompletedCourses] = useState<number>(0);
    const [userName, setUserName] = useState<string>("USER_NAME");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 경험치와 레벨 가져오기
                const { exp, level } = await gethUserExperience();
                setExperience(exp);
                setLevel(level);

                // 사용자 이름 가져오기
                const name = await getUserName();
                setUserName(name);

                // 게임 히스토리 가져오기 및 완료한 코스 수 계산
                const history = await getPastGames();
                setGameHistory(history);
                setCompletedCourses(history.length); // 게임 히스토리의 길이를 완료한 코스 수로 사용
            } catch (error) {
                console.error('데이터 불러오기 실패:', error);
            }
        };

        fetchData();
    }, []);

    const calculateProgress = () => {
        if (experience === null) return 0;
        // 임시로 레벨당 500점으로 계산
        return (experience % 500) / 500 * 100;
    };

    return (
        <div className="experience-container">
            <div className="profile-header">
                <div className="profile-circle">B</div>
                <div className="profile-name">{userName}</div>
            </div>
            <div className="profile-stats">
                <div 
                    className="stat-item clickable-stat" 
                    onClick={() => setIsModalOpen(true)}
                >
                    <div className="stat-value">{completedCourses}</div>
                    <div className="stat-label">
                        Courses Complete
                        <span className="view-details">👆 Click to view details</span>
                    </div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{experience || 0}</div>
                    <div className="stat-label">Total Points</div>
                </div>
            </div>
            
            <div className="level-progress-container">
                <div className="level-icon-container">
                    <LevelIcon />
                </div>
                <div className="progress-section">
                    <div className="exp-text">{calculateProgress().toFixed(1)}% exp points</div>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${calculateProgress()}%` }}
                        ></div>
                    </div>
                    <div className="level-text">LEVEL {level || 1}</div>
                </div>
            </div>
            <GameHistoryModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                history={gameHistory}
            />
        </div>
    );
};

export default MyEx;
