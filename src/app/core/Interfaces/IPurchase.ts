import {IUser} from './IUser';
import {IArticle} from './IArticle';

export interface IPurchase {
  id?: string;
  purchaseDate?: string;
  articles?: IArticle[];
  buyer?: IUser;
  total?: number;
  purchasesArticles?: IArticle[];
}
