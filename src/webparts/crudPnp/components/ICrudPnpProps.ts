import {WebPartContext} from '@microsoft/sp-webpart-base';

export interface ICrudPnpProps {
  description: string;
  context: WebPartContext,
  siteurl: string;
}
