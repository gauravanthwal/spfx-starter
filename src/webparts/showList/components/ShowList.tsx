import * as React from "react";
import styles from "./ShowList.module.scss";
import { IShowListProps } from "./IShowListProps";
import { escape } from "@microsoft/sp-lodash-subset";
import * as pnp from "sp-pnp-js";

export interface IListState {
  listitems: any[];
}

export default class ShowList extends React.Component<
  IShowListProps,
  IListState,
  {}
> {
  static websiteurl: string = "";
  public constructor(props: IShowListProps, state: IListState) {
    super(props);
    this.state = {
      listitems: [],
    };
    ShowList.websiteurl = this.props.siteurl;
  }

  public componentDidMount() {
    pnp.sp.web.lists
      .getByTitle("Demo")
      .items.get()
      .then((items: any[]) => {
        this.setState({ listitems: items });
        console.log(items);
      });
  }

  public render(): React.ReactElement<IShowListProps> {
    return (
      <div className={styles.showList}>
        <h1>List Content</h1>
        <table className={styles.table}>
          <tr>
            <th>Sno</th>
            <th>Name</th>
            <th>Age</th>
            <th>Address</th>
          </tr>
          {this.state.listitems.map((list, index) => {
            let fullurl: string = `${ShowList.websiteurl}/lists/Demo/DispForm.aspx?ID=${list.ID}`;
            return (
              <tr>
                <td>{index + 1}</td>
                <td>
                  <a className={styles.link} href={fullurl} target="_blank">
                    {list.Title}
                  </a>
                </td>
                <td>{list.Age}</td>
                <td>{list.Address}</td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}
