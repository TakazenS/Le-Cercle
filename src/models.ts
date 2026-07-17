export interface RegisterPayload {
    email: string;
    first_name: string;
    last_name: string;
    nickname: string;
    password: string;
    access_code: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}
