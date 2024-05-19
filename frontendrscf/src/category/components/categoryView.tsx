import React, {Component} from 'react'
import { Select, Spin } from 'antd';
import {getCategoryList, AddCategoryToDataBase} from "../../api/categoryApi";

interface categoryProps {
}

interface categoryState {
  CategoryID: string,
  CategoryName: string,
  parentID: string,
  parentName: any,
  manufacturer: string,
  supplier: string,
  specific:string,
  selectOptions: categoryOptionType[],
  selectedItems: [],
  // createDate: Date
}

interface categoryOptionType {
  label: string;
  value: string | undefined;
} 

export class CategoryView extends Component<categoryProps, categoryState> {
  constructor(props: categoryProps) {
    super(props);
    this.onChangeCategoryName = this.onChangeCategoryName.bind(this); 
    this.onChangeParentName = this.onChangeParentName.bind(this);   
    this.onChangeManufacturer = this.onChangeManufacturer.bind(this);
    this.onChangeSupplier = this.onChangeSupplier.bind(this);
    this.onChangeSpecific = this.onChangeSpecific.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      CategoryID:"",
      CategoryName: "",
      parentID: "",
      parentName: "",
      manufacturer: "",
      supplier: "",
      specific:"",
      selectOptions:[],
      selectedItems:[],
    };
  }

  onChangeCategoryName(e:React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      CategoryName: e.target.value,
    });
  }

  // onChangeParentName(e:React.ChangeEvent<HTMLSelectElement>) {
  onChangeParentName(e:any) {
    // this.setState({ parentName: categoryType as UserOrOrg })
    this.setState({
      parentName: e.label,
      parentID: e.value,
    });
  }

  onChangeManufacturer(e:React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      manufacturer: e.target.value,
    });
  }

  onChangeSupplier(e:React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      supplier: e.target.value,
    });
  }

  onChangeSpecific(e:React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      specific: e.target.value,
    });
  }

  componentDidMount(): void {
    setTimeout(async () => {
      this.fetchCategoryOption();
      console.log("componentDidMount get options of select");       
    }
    )
  }

  async fetchCategoryOption() {
    console.log('fetching Category');
    const categoryList = await getCategoryList();   
    const categoryOptions = categoryList.map((item) => {
      return {
        // label: `${item.categoryId} ${item.parentID}`,
        label: `${item.CategoryName}`,
        value: item.CategoryID
      }
    }) 
    this.setState({
      selectOptions: categoryOptions
    })
    console.log(categoryOptions)
    return categoryOptions;
  }


  async onSubmit(e:React.FormEvent<HTMLFormElement>) {
    const category = {       
      CategoryID: this.state.CategoryID,
      CategoryName: this.state.CategoryName,   
      parentID: this.state.parentID, 
      parentName: this.state.parentName,   
      manufacturer: this.state.manufacturer,
      supplier: this.state.supplier,         
      specs: this.state.specific,
      current: 0,
      size: 0,
    };    
    const message = await AddCategoryToDataBase(category);; 
    if(message){
      alert(message);
    }       
  }

  openCategoryListView () {

  }

  render() {
    return (
      <div style ={{margin:10, backgroundColor:"#EDF5E1"}}>
        <form className="row g-3" onSubmit={this.onSubmit}>
          <div className="col-md-6">
            <label htmlFor="inputCategoryName" className="form-label">Category Name: </label>
            <input type="text" className="form-control" id="inputCategoryName"
              required            
              value={this.state.CategoryName}
              onChange={this.onChangeCategoryName}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="inputParentName" className="form-label">Parent Name: </label>
            <Select id="inputParentName" className="form-select" 
              labelInValue
              filterOption={false}           
              placeholder="Choose Parent Category"
              // fetchOptions={this.fetchCategoryList}
              value={this.state.parentName}
              onChange={this.onChangeParentName}
              options={this.state.selectOptions}
              // onSelect={this.onChangeParentName} 
              >
            </Select>
          </div>
          <div className="col-md-8">
            <label htmlFor="inputManufacturer" className="form-label">Manufacturer:</label>
            <input type="text" className="form-control" id="inputManufacturer" placeholder=""
              value={this.state.manufacturer}
              onChange={this.onChangeManufacturer}
            />
          </div>
          <div className="col-md-8">
            <label htmlFor="inputSupplier" className="form-label">Supplier:</label>
            <input type="text" className="form-control" id="inputSupplier" placeholder=""
              value={this.state.supplier}
              onChange={this.onChangeSupplier}
            />
          </div>
          <div className="col-md-8">
            <label htmlFor="inputSpecific" className="form-label">Discription:</label>
            <input type="text" className="form-control" id="inputSpecific"
               value={this.state.specific}
               onChange={this.onChangeSpecific}
            />
          </div>       
          {/* <div className="col-12">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="gridCheck"/>
              <label className="form-check-label" htmlFor="gridCheck">
                default 
              </label>
            </div>
          </div> */}
          <div className="col-12">
            <button type="submit" className="btn btn-primary buttonMargin" style ={{backgroundColor:"#C0D9D9"}}           
                value="Add Category" >Add</button>
            <button className="btn btn-primary" onClick={()=> window.open("./#/categoryList", "_blank")}>Category List</button>
          </div>
        </form>  
      </div>
    );
  }
}

export default CategoryView;
