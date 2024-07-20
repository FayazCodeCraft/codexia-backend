declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    SALT_ROUNDS: number;
    JWT_SECRET: string;
    EXPIRES_IN: string;
  }
}
