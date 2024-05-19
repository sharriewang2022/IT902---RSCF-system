import React, { Component } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom';

type propType =() =>{
    loggedIn: boolean;
    username?: string
}

interface testProps {
    name: string;
    // updateUser: ()=>{
    //     loggedIn: boolean,
    //     username: string
    // }
 
    updateUser: (loggedIn: boolean,username?: string) => void;
}

interface testState{
    count: number,
    testStr: string
}

class Logout extends Component<testProps, testState> {
    constructor(props: testProps) {    
        super(props);
        this.logout = this.logout.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            count: 0,
            testStr:""
        };
    }

    componentDidMount() {
        this.logout();
    }

    handleChange(event : React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({count: 1, testStr: event.target.value});
    }
    

    logout() {
        console.log('logging out')
        axios.get(`${localStorage.getItem('backendURL')}/logout`).then(response => {
          console.log(response.data)
          if (response.status === 200) {
            this.props.updateUser( false, "");
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username');
          }
        }).catch(error => {
            console.log('Logout error')
        })
    }
    render() {
        return(
            <Navigate to="/"/>
        )
    }
}

export default Logout;