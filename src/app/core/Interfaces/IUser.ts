import {IArticle} from './IArticle';

export interface IUser {
  id?: string;
  name?: string;
  email?: string;
  admin?: boolean;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  authParamsId?: string;
}
