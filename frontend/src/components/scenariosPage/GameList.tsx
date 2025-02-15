import React, { useEffect, useState } from 'react';
import { getGameList } from '../../api/AiScenariosChat';
import '../../css/scenarioPage/GameList.css';

interface Game {
  id: string;
  name: string;
}

interface GameListProps {
  onSelect: (gameId: string) => void;
  selectedGame: string | null;
}

const GameList: React.FC<GameListProps> = ({ onSelect, selectedGame }) => {
  const [gameList, setGameList] = useState<Game[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameList = async () => {
      try {
        const games: { _id: string; game: string; description: string; __v: number }[] = await getGameList();
        setGameList([{ id: '', name: '게임 미선택' }, ...games.map(g => ({ id: g._id, name: g.game }))]);
      } catch (error) {
        console.error('게임 목록을 가져오는 중 오류 발생:', error);
        setError('게임 목록을 불러오는 데 실패했습니다.');
      }
    };

    fetchGameList();
  }, []);

  useEffect(() => {
    if (gameList.length > 0) {
      onSelect(gameList[currentIndex].id);
    }
  }, [currentIndex, gameList, onSelect]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : gameList.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < gameList.length - 1 ? prevIndex + 1 : 0));
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="gameList-container">
      <button className="gameList-nav-button" onClick={handlePrev}>
        &lt;
      </button>
      <ul className="gameList-ul" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {gameList.map((game, _index) => (
          <li key={game.id} className={`gameList-li ${selectedGame === game.id ? 'gameList-selected' : ''}`}>
            <span className="gameList-text">{game.name}</span>
          </li>
        ))}
      </ul>
      <button className="gameList-nav-button" onClick={handleNext}>
        &gt;
      </button>
    </div>
  );
};

export default GameList;