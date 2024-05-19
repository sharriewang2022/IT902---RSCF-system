// fetch menu items
import {SERVER_BASE_URL} from "../../config/sysConfig";
import axios from 'axios';

const FetchDashboard = async () => {
  const sendData = {
    groupId: localStorage.getItem('groupId')
  }

  const result = await axios.post(SERVER_BASE_URL + '/menu/getSomeMenu', sendData);
    // return the result
    return result;
  }
 
export default FetchDashboard;

// fetch sub menu items
export const FetchDashboardSubList = async () => {
  const sendData = {
    groupId: localStorage.getItem('groupId'),
    moduleId: 1 // this parameter for each menu
  }

  const result = await axios.post(SERVER_BASE_URL + '/menu/getAllMenus', sendData);
  // return the result
  return result;
}


<div className="accordion">
  {/* {data.map(({ title, content }) => (
  <AccordionMenu title={title} content=
    {FetchDashboardSubList().then(resp => {
      setDataSubList(resp.data);
      dataSubList.map(({itemNameEng,pageLink}) => (
      <AccordionMenuSubList itemNameEng={itemNameEng} pageLink={pageLink}/>                   
      ))
    })} 
    />
  ))} */}
</div>

           