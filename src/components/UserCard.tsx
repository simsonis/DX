import React from 'react';
import './styles/UserCard.css';

export interface UserCardProps {
  className?: string;
  children?: React.ReactNode;
  // Add your props here
}

const UserCard: React.FC<UserCardProps> = ({ 
  className = '', 
  children,
  ...props 
}) => {
  return (
    <div className={`usercard ${className}`} {...props}>
      {children}
      <p>Welcome to UserCard component!</p>
    </div>
  );
};

export default UserCard;
