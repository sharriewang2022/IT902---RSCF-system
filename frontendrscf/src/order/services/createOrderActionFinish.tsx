import React from 'react'
import {Button} from 'react-bootstrap';

function CreateOrderActivityFinish() {

  function getOrdersList(){
    window.open("./#/orderListView", "_blank")
  }

  return ( 
    <div className="App-header" style={{"textAlign":"center","margin":"80px"}}>
      <h4>Order activity has been created successfully!</h4>
      <Button className="btn btn-primary" variant="primary" onClick={getOrdersList}>
            Order List
      </Button>         
    </div> 
  );
}

export default CreateOrderActivityFinish;