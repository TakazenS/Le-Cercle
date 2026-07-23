export interface RegisterPayload {
    email: string;
    first_name: string;
    last_name: string;
    pseudo: string;
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

export interface MeResponse {
    email: string;
    firstName: string;
    lastName: string;
    nickname: string;
    pseudo: string;
    description?: string | null;
}

export interface Server {
    id: string;
    name: string;
    url: string;
}
