import {IArticle} from './IArticle';

export interface IPaymentRequest {
  articles: IArticle[];
  successUrl: string;
  errorUrl: string;
  payWithPoints: boolean;
}

export interface IPaymentResponse {
  sessionId: string;
  payWithPoints: boolean;
  cashPoints: number;
  totalPrice: number;
}
