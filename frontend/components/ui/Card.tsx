import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white dark:bg-primary shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-accent ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-4 border-b border-gray-100 dark:border-gray-700 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardContent: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-4 ${className}`} {...props}>
            {children}
        </div>
    );
};
