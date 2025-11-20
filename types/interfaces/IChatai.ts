export interface IChatai {
  sender: string;
  text: string;
}

export interface IChaitaiAsk {
  message: string;
  messages: IChatai[];
  questions: IChatai[];
  error?: string;
}
