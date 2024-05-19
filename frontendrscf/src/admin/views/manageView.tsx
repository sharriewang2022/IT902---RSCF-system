import React, {useState} from 'react';
import {Nav, Navbar, NavDropdown, Container} from "react-bootstrap";
import {useAuth} from '../../contexts/authContext';
import {useNavigate} from "react-router-dom"; 
import "../../css/navbar.css";
import {About} from "../components/about";
import UserList from "./userListView";

// Button Link is on the top. could use in product:add product; product List
export function ManageView(props:any){
    const [icon, setIcon] = useState(true);
    const [open,setOpen] = useState(false);
    const {logout} = useAuth();
    const navigate = useNavigate(); 

    const handlelogout = async (e : React.MouseEvent<HTMLElement>) => {
      await logout(); 
      navigate('/') // go to login
    }
      
    function handleOpen(){
      setOpen(true)
    }

    return(<div style = {{
      height:"100vh",
        backgroundColor:"#C0D9D9"
      }}>
       {/* //navbar-expand-lg |xl|lg|md|sm screen stype*/}
      <Navbar expand ="lg" style = {{
              background: "#C0D9D9",
              overflow:"visible",
              borderBottom:"4px solid #05386B",
      }} sticky="top" collapseOnSelect>
              <Navbar.Brand style = {{
                marginLeft: "50px",
                color:"#05386B",
                fontWeight: "500",
                fontSize:"22px",
                flexGrow: "10"
              }}>              
              </Navbar.Brand>
              <Navbar.Toggle style = {{
                border:"none",
                color: "#05386B",
                fontSize:"25px"
              }}  onClick = {() => {setIcon(prev => !prev)}}>
                <i className = {icon? "fa fa-bars":"fa fa-times"} ></i>
              </Navbar.Toggle>
              <Navbar.Collapse>
          <Nav onSelect={() => setIcon(prev => !prev)}>
              <Nav.Link href="./#/register" >Add User</Nav.Link>
              < NavDropdown title = "other">
                <NavDropdown.Item onClick = {handleOpen}>About</NavDropdown.Item>
                <NavDropdown.Item onClick = {handlelogout} >Logout</NavDropdown.Item>
            </NavDropdown>
              </Nav>
              </Navbar.Collapse>
            </Navbar>
            <Container>                
                <About open = {open} setOpen = {setOpen}/>
            </Container>  
            
            <UserList></UserList> 
            
            </div>            
          )
}