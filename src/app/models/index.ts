export interface Position {
  symbol: string;
  quantity: number;
}

export interface Order {
  tradeId: string;
  symbol: string;
  quantity: number;
  actionType: ActionType;
  orderType: OrderType;
}

export enum ActionType {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  CANCEL = 'CANCEL',
}

export enum OrderType {
  BUY = 'BUY',
  SELL = 'SELL',
}
