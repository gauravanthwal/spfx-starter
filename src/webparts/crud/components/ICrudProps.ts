import {WebPartContext} from '@microsoft/sp-webpart-base';

export interface ICrudProps {
  description: string;
  context: WebPartContext;
  siteurl: string;
}
