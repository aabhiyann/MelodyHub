// Component Prop Types
import { ReactNode, CSSProperties } from 'react';

export interface BaseComponentProps {
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

export interface ModalProps extends BaseComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export interface ButtonProps extends BaseComponentProps {
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    type?: 'button' | 'submit' | 'reset';
}
