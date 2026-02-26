// API Response Types

export interface APIResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

import { User } from './models';

export interface AuthResponse {
    user: User;
    token?: string;
}
