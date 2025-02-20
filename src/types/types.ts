export type RootStackParamList={
    Home:undefined,
    Login:undefined,
    Setting:undefined
};
export interface UserInfo {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
    uid: string;
  }