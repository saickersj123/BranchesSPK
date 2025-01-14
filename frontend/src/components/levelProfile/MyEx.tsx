import React, { useEffect, useState } from 'react';
import { gethUserExperience } from '../../api/UserInfo';
import '../../css/levelProfilePage/MyEx.css';

const MyEx: React.FC = () => {
    const [experience, setExperience] = useState<number | null>(null);
    const [level, setLevel] = useState<number | null>(null);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const { exp, level } = await gethUserExperience();
                setExperience(exp);
                setLevel(level);
            } catch (error) {
                console.error('경험치 불러오기 실패:', error);
            }
        };

        fetchExperience();
    }, []);

    return (
        <div className="experience-container">
            <h1 className="experience-title">내 경험치</h1>
            {experience !== null && level !== null ? (
                <p className="experience-value">경험치: {experience} / 레벨: {level}</p>
                // 유저 스키마에 level값이 있길래 받아와서 출력도 하게 해둠.
            ) : (
                <p className="loading-message">경험치를 불러오는 중...</p>
            )}
        </div>
    );
};

export default MyEx;
