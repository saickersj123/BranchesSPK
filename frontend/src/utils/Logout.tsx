import { useNavigate } from 'react-router-dom';
import { logout } from '../api/UserInfo';

const useLogout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const logoutSuccess = await logout();
            if (logoutSuccess) {
                navigate('/'); // 홈으로 이동
            } else {
                console.error('로그아웃 실패');
            }
        } catch (error) {
            console.error('로그아웃 처리 중 오류 발생:', error);
        }
    };

    return handleLogout;
};

export default useLogout;
