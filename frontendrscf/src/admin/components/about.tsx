import React from "react";
import {
Typography,
Button,
Dialog,
DialogActions,
DialogContent,
DialogTitle,
} from '@material-ui/core';
import {} from "@material-ui/core";

export function About(props:any){

    const {open,setOpen} = props
    const handleClose = () => {
        setOpen(false);
    };

    return(
      <div>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title">
          About
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
          This application provides platform for logistics companies to help
          their customers track products. The application will have different login actors for
          distributer, retailer, customers, and manufacturers.
          Here is how the process work:
          </Typography>
          <Typography gutterBottom>
            <ul>
              <li>
              Manufacturer can add product on the portal and search the product information
              after adding the product.
              </li>
              <li>
              Then the distributer can trace the information of the product.
                </li>
                <li>
                Hence, when the product finally reach the retailer and consumers they can easily 
                check each and every information of the product from the blockchain.
                </li>
            </ul>
          </Typography>
          <Typography gutterBottom>
          The application will allow different stakeholders (manufacturers, importer, retailer etc.) to
          track the product at the process and upload the financial files.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    )
}