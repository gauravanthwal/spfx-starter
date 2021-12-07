import * as React from "react";
import styles from "./Crud.module.scss";
import { ICrudProps } from "./ICrudProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { ICrudWithReact } from "./CrudWithReact";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import { ICrud } from "./ICrud";

interface ICrudState {
  listitems: any[];
  name: string;
  age: string;
  address: string;
  showAdd: boolean;
  isShowUpdate: boolean;
  showForm: boolean;
  updateItemId: string;
}

export default class Crud extends React.Component<ICrudProps, ICrudState, {}> {
  public constructor(props: ICrudProps, state: ICrudState) {
    super(props);
    this.state = {
      listitems: [],
      name: "",
      age: "",
      address: "",
      showAdd: false,
      isShowUpdate: false,
      showForm: false,
      updateItemId: "",
    };
    this.toggleAdd = this.toggleAdd.bind(this);
    this.addItems = this.addItems.bind(this);
    this.showUpdate = this.showUpdate.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
  }

  // show form part
  public toggleForm(): void {
    this.setState({
      showForm: !this.state.showForm,
      showAdd: false,
      isShowUpdate: false,
    });
  }

  // toggle show Add part
  public toggleAdd(): void {
    this.toggleForm();
    this.setState({
      name: "",
      age: "",
      address: "",
      showAdd: !this.state.showAdd,
      isShowUpdate: false,
    });
  }

  // show update part
  public showUpdate(ID: string): void {
    this.toggleForm();

    console.log("clicked ID", ID);
    let item: any[] = this.state.listitems.filter((item:any) => item.ID == ID);

    this.setState({
      updateItemId: ID,
      name: item[0].Title,
      age: item[0].Age,
      address: item[0].Address,
      isShowUpdate: !this.state.isShowUpdate,
      showAdd: false,
    });
  }

  // Get all lists
  private _getListItems(): Promise<ICrud[]> {
    const url: string =
      this.props.siteurl + "/_api/web/lists/getbytitle('Demo')/items";
    return this.props.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return json.value;
      }) as Promise<ICrud[]>;
  }

  // Add item into list
  public addItems(): void {
    const url: string =
      this.props.siteurl + "/_api/web/lists/getbytitle('Demo')/items";

    const spHttpClientOption: ISPHttpClientOptions = {
      body: JSON.stringify({
        Title: this.state.name,
        Age: this.state.age,
        Address: this.state.address,
      }),
    };

    this.props.context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, spHttpClientOption)
      .then((response: SPHttpClientResponse) => {
        if (response.status === 201) {
          console.log("success");
        } else {
          console.log(response.statusText);
        }
      })
      .then(() => {
        this._getListItems().then((items) => {
          this.setState({ listitems: items });
        });
      })
      .then(() => {
        this.toggleAdd();
      });
  }

  // Update item into list
  private updateItem(): void {
    console.log(this.props.siteurl);

    const url: string =
      this.props.siteurl +
      "/_api/web/lists/getbytitle('Demo')/items(" +
      this.state.updateItemId +
      ")";

    const headers:any = {
      "X-HTTP-Method": "MERGE",
      "IF-MATCH": "*",
    };

    const spHttpClientOptions: ISPHttpClientOptions = {
      headers: headers,
      body: JSON.stringify({
        Title: this.state.name,
        age: this.state.age,
        address: this.state.address,
      }),
    };

    this.props.context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, spHttpClientOptions)
      .then((response: SPHttpClientResponse) => {
        if (response.status === 204) {
          console.log("successfully updated");
        } else {
          console.error(response.statusText);
        }
      });
  }

  // componentDidMount call
  public componentDidMount() {
    this._getListItems().then((items) => {
      this.setState({ listitems: items });
      console.log(items);
    });
  }

  public render(): React.ReactElement<ICrudProps> {
    return (
      <div className={styles.crud}>
        <h1>List Content</h1>
        {this.state.isShowUpdate == true
          ? ""
          : this.state.showAdd == false && (
              <button onClick={this.toggleAdd} className={styles.btn}>
                + New
              </button>
            )}

        {/* Form code */}
        {this.state.showForm && (
          <div className={styles.addlist}>
            <div className={styles.input}>
              <input
                required
                type="text"
                placeholder="Enter Name"
                value={this.state.name}
                onChange={(e) =>
                  this.setState({
                    ...this.state,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.input}>
              <input
                required
                type="text"
                placeholder="Enter Age"
                value={this.state.age}
                onChange={(e) =>
                  this.setState({
                    ...this.state,
                    age: e.target.value,
                  })
                }
              />
            </div>
            <div className={styles.input}>
              <input
                required
                type="text"
                placeholder="Enter Address"
                value={this.state.address}
                onChange={(e) =>
                  this.setState({
                    ...this.state,
                    address: e.target.value,
                  })
                }
              />
            </div>
            {/* onClick={this.addItems} */}
            <button
              onClick={
                this.state.isShowUpdate ? this.updateItem : this.addItems
              }
              className={styles.btnCenter}
            >
              {this.state.showAdd ? "Save" : "Update"}
            </button>
            <button onClick={this.toggleForm} className={styles.cancelbtn}>
              &#10006;
            </button>
          </div>
        )}

        {/* Table code */}

        <table className={styles.table}>
          <tr>
            <th></th>
            {/* <th></th> */}
            <th>Sno</th>
            <th>Name</th>
            <th>Age</th>
            <th>Address</th>
            <th>ID</th>
          </tr>
          {this.state.listitems.map((list, index) => {
            return (
              <tr className={styles.tableRow}>
                <td className={styles.invisibleTr}>
                  <button
                    className={styles.selectBtn}
                    onClick={() => this.showUpdate(list.ID)}
                  >
                    &#9998;
                  </button>
                </td>
                {/* <td className={styles.invisibleTr}>
                  <button className={styles.selectBtn}>&#10005;</button>
                </td> */}
                <td>{index + 1}</td>
                <td>{list.Title}</td>
                <td>{list.Age}</td>
                <td>{list.Address}</td>
                <td>{list.ID}</td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}
