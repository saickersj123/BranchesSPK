import React, { useEffect, useState } from 'react';
import { gethUserExperience, getPastGames } from '../../api/UserInfo';
import { checkAuthStatus } from '../../api/axiosInstance';
import '../../css/levelProfilePage/MyEx.css';
import LevelIcon from '../../utils/LevelIcon';
import GameHistoryModal from './GameHistoryModal';
import ProfileHeader from './ProfileHeader';
import StatItem from './StatItem';
import ProgressBar from './ProgressBar';

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
    const [userName, setUserName] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 경험치와 레벨 가져오기
                const { exp, level } = await gethUserExperience();
                setExperience(exp);
                setLevel(level);

                // 사용자 이름 가져오기
                const name = await checkAuthStatus();
                setUserName(name.user?.name || "");

                // 게임 히스토리 가져오기 및 완료한 코스 수 계산
                const history = await getPastGames();
                setGameHistory(history);
                setCompletedCourses(history.length); // 게임 히스토리의 길이를 완료한 코스 수로 사용

                setLoading(false);
            } catch (error) {
                console.error('데이터 불러오기 실패:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const calculateProgress = () => {
        if (experience === null) return 0;
        // 임시로 레벨당 500점으로 계산
        return (experience % 500) / 500 * 100;
    };

    return (
        <div className="experience-container">
            <ProfileHeader userName={userName} />
            <div className="profile-stats">
                <StatItem 
                    value={completedCourses} 
                    label="Courses Complete"
                    onClick={() => setIsModalOpen(true)}
                    isClickable={true}
                >
                    <span className="view-details">👆 Click to view details</span>
                </StatItem>
                <StatItem 
                    value={experience || 0} 
                    label="Total Points"
                />
            </div>
            
            <div className="level-progress-container">
                <div className="level-icon-container">
                    <LevelIcon />
                </div>
                <div className="progress-section">
                    <div className="exp-text">{calculateProgress().toFixed(1)}% exp points</div>
                    <ProgressBar progress={calculateProgress()} />
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
