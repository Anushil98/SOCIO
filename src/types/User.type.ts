export type UserType = "Private" | "Public";

// export type Gender = "Male" | "Female" | "Other";

export interface SignUpArgs {
  userType: UserType;
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  username: string;
}

export interface AuthPayload {
  accessToken: string;
  refreshAccessToken: string;
  userId: string;
}

export interface IpToken {
  timestamp: number;
  tokens: number;
  ip: string;
}
