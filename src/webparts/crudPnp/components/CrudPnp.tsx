import * as React from "react";
import styles from "./CrudPnp.module.scss";
import { ICrudPnpProps } from "./ICrudPnpProps";
import { escape } from "@microsoft/sp-lodash-subset";
import * as pnp from "sp-pnp-js";

interface ICrudState {
  listitems: any[];
  name: string;
  age: string;
  address: string;
  showAdd: boolean;
  isShowUpdate: boolean;
  showForm: boolean;
  itemId: number;
  loading: boolean;
}
interface ICrud {
  id: number;
  Title: string;
  Age: string;
  Address: string;
}

export default class CrudPnp extends React.Component<
  ICrudPnpProps,
  ICrudState,
  {}
> {
  public constructor(props: ICrudPnpProps, state: ICrudState) {
    super(props);
    this.state = {
      listitems: [],
      name: "",
      age: "",
      address: "",
      showAdd: false,
      isShowUpdate: false,
      showForm: false,
      itemId: null,
      loading: false,
    };
    this.toggleAdd = this.toggleAdd.bind(this);
    this.showUpdate = this.showUpdate.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addListItem = this.addListItem.bind(this);
    this.updateListItem = this.updateListItem.bind(this);
    this.deleteListItem = this.deleteListItem.bind(this);
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

    let item: any[] = this.state.listitems.filter((item) => item.ID == ID);

    this.setState({
      itemId: parseInt(ID),
      name: item[0].Title,
      age: item[0].Age,
      address: item[0].Address,
      isShowUpdate: !this.state.isShowUpdate,
      showAdd: false,
    });
  }

  // Get all lists
  public getAllListItems(): void {
    try {
      this.setState({ loading: true });
      pnp.sp.web.lists
        .getByTitle("Demo")
        .items.get()
        .then((res) => {
          console.log(res);

          this.setState({ loading: false, listitems: res });
        });
    } catch (err) {
      console.error(err);
    }
  }

  // Add item into list
  public addListItem(): void {
    const url = this.props.siteurl + "/_api/web/lists/getbytitle('Demo')/items";
    try {
      pnp.sp.web.lists
        .getByTitle("Demo")
        .items.add({
          Title: this.state.name,
          Age: this.state.age,
          Address: this.state.address,
        })
        .then((res) => {
          console.log(res);
        })
        .then(() => {
          this.getAllListItems();
        })
        .then(() => {
          this.toggleForm();
        });
    } catch (err) {
      console.log(err);
    }
  }

  // Update item into list
  public updateListItem(): void {
    try {
      this.setState({ loading: true });
      pnp.sp.web.lists
        .getByTitle("Demo")
        .items.getById(this.state.itemId)
        .update({
          Title: this.state.name,
          Age: this.state.age,
          Address: this.state.address,
        })
        .then((res) => {
          console.log(res);
          this.getAllListItems();
        })
        .then(() => {
          this.setState({ loading: false });
          this.toggleForm();
        });
    } catch (err) {
      console.error(err);
    }
  }

  // Delete item into list
  public deleteListItem(ID: string): void {
    try {
      pnp.sp.web.lists
        .getByTitle("Demo")
        .items.getById(parseInt(ID))
        .delete()
        .then(() => {
          alert("No. of Items Deleted: 1");
          this.getAllListItems();
        });
    } catch (err) {
      console.error(err);
    }
  }

  // componentDidMount call
  public componentDidMount() {
    this.getAllListItems();
  }

  public render(): React.ReactElement<ICrudPnpProps> {
    return (
      <div className={styles.crudPnp}>
        {this.state.loading && (
            <div className={styles.loading}>
              <p>Loading Data...</p>
          </div>
        )}
        <h1>
          {this.state.showAdd
            ? "Add New Item In the List"
            : this.state.isShowUpdate
            ? `Update Item ID: ${this.state.itemId}`
            : "List Content"}
        </h1>
        {this.state.isShowUpdate == true
          ? ""
          : this.state.showAdd == false && (
              <button onClick={this.toggleAdd} className={styles.btn}>
                + New
              </button>
            )}

        {/*****************  Form code ***********************/}
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
            <button
              onClick={
                this.state.isShowUpdate ? this.updateListItem : this.addListItem
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

        {/*****************  Table code ***********************/}
        <table className={styles.table}>
          <tr>
            <th className={styles.invisibleTr}>Sno</th>
            <th>Name</th>
            <th>Age</th>
            <th>Address</th>
            <th></th>
            <th></th>
          </tr>
          {this.state.listitems.map((list, index) => {
            return (
              <tr className={styles.tableRow}>
                <td className={styles.invisibleTr}>{index + 1}</td>
                <td>
                  <strong>{list.Title}</strong>
                </td>
                <td>{list.Age}</td>
                <td>{list.Address}</td>
                <td className={styles.invisibleTr}>
                  <button
                    className={styles.selectBtn}
                    onClick={() => this.showUpdate(list.ID)}
                  >
                    &#9998;
                  </button>
                </td>
                <td className={styles.invisibleTr}>
                  <button
                    onClick={() => this.deleteListItem(list.ID)}
                    className={styles.deleteBtn}
                  >
                    &#10005;
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}
