export interface IChatai {
  sender: string;
  text: string;
}

export interface IChaitaiAsk {
  message: string;
  replyHistory: IChatai[];
}
