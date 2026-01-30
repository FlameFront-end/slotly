export interface LoginPayload {
	email: string
	password: string
}

export interface RegisterPayload {
	email: string
	password: string
	name: string
}

export interface LoginResponse {
	access_token: string
	refresh_token: string
}

export interface RegisterResponse {
	message: string
}

export interface RefreshTokenResponse {
	access_token: string
}
