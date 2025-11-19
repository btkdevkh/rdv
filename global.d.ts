// global.d.ts
export {};

declare global {
  interface Window {
    __USER_DATA__?: {
      userId?: string;
      [key: string]: any;
    };
  }
}
