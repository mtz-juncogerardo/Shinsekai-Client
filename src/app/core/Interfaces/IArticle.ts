import {ITag} from './ITag';
import {IImage} from './IImage';

export interface IArticle {
  id: string;
  name: string;
  height?: number;
  price?: number;
  discountPrice?: number;
  stock?: number;
  originalFlag?: boolean;
  details?: string;
  dateAdded?: Date;
  animes?: ITag[];
  brand?: ITag[];
  materials?: ITag[];
  lines?: ITag[];
  images: IImage[];
  timesSold?: number;
  originalSerial?: string;
}
