// frontend/src/components/levelProfile/ProfileHeader.tsx
import React from 'react';

interface ProfileHeaderProps {
    userName: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName }) => (
    <div className="profile-header">
        <div className="profile-circle">{userName.charAt(0).toUpperCase()}</div>
        <div className="profile-name">{userName}</div>
    </div>
);

export default ProfileHeader;