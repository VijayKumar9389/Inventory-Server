export interface CreateUserDTO {
    username: string;
    password: string;
}

export interface TokenResponse {
    auth: boolean;
    accessToken: string;
    refreshToken?: string;
    user?: string;
}