import {ICrud} from './ICrud';

export interface ICrudWithReact {
    listitems: ICrud[];
    listItem: ICrud;
    form: {
        name: string;
        age: string;
        address: string;
    };
}