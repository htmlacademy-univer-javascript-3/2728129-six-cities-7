export type User = {name: string; avatarUrl: string; isPro: boolean; email: string};
export type AuthInfo = User & {token: string};
export type AuthorizationStatus = 'Unknown' | 'Auth' | 'NoAuth';
