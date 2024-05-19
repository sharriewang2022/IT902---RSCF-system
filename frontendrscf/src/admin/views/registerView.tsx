import React, { useState } from "react"
import {useAuth} from "../../contexts/authContext";
import {ROLES} from "../../util/constant";
import {makeStyles} from "@material-ui/core/styles";
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Typography,
  Paper,
  Link,
  Grid,
  Button,
  MenuItem,
  TextField,
  Divider,
  Snackbar,
  Container
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { UserType } from "../../util/variableTypes";

function Alert(props:any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const validationSchema = yup.object({
    role: yup
      .string()
      .required('Select a role'),
    userEmail: yup
      .string()
      .email('Enter a valid email'),
    userPassword: yup
      .string()
      .min(8, 'Password should be of minimum 8 characters length').required('Enter a password'),
    passwordConfirmation: yup.string()
      .oneOf([yup.ref('userPassword')], 'Passwords must match')
  });

  const useStyle = makeStyles((theme)=>({
    root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          borderColor: "#C0D9D9 !important",
          Color: "#EDF5E1 !important"
        }},
          input:{
              color:"#87CEFA !important"
          },
          label:{
            color: "#87CEFA !important",
            fontSize:"17px"
          },
          notchedOutline:{
            borderWidth: "2px",
            borderColor: "#C0D9D9 !important",
            color:"#87CEFA !important"
          },
          button: {
            backgroundColor: "#C0D9D9",
            color: "#05386B",
            justifySelf:"center",
            marginTop: "20px",
            marginleft: "100px",
            "&:hover" :{
                backgroundColor:"#87CEFA"
            }
        },
        divide:{
            background:"#87CEFA !important"
        }
  }))

function RegisterView() {
    const {signUp} = useAuth()
    const style = useStyle()
    const [err,setErr] = useState(0);
    const [open ,setOpen] = useState(false)
    const [openErr,setOpenErr] = useState(false)

    const formik = useFormik({
        initialValues: {
            userName:"",
            userPassword:"",
            role:"",
            userEmail:"",
            userID:"",
            telephone:0,
            passwordConfirmation:""
        },
        validationSchema: validationSchema,
        onSubmit: handleSignUp
    })

    async function handleSignUp(values:any){
        const userInfo :UserType={
            userName: values.userName,
            userPassword: values.userPassword,
            role: values.role,
            userEmail:values.userEmail,
            userID:"",
            telephone: values.telephone
        }
        try{
            var result = await signUp(userInfo)
            setOpen(true);                               
        } catch(error:any){
            setErr(error.message)
            setOpenErr(true)
        }
    }

    const handleEventClose = (event:React.ChangeEvent, reason:string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setOpenErr(false);
    };

    return(<div style = {{
        position:"absolute",
            top:"0",
            left:"0",
            bottom:"0",
            right:"0",
            height:"100%",
            width:"100%",
            backgroundColor:"#C0D9D9"
        }}>
    <Container component = "main" maxWidth = "xs" style = {{
        marginTop:"10px"
    }}>
    {open &&<Snackbar open={open} autoHideDuration={8000} onClose={()=>handleEventClose}>
        <Alert onClose={handleEventClose} severity="success">
            User Created Successfully!!
        </Alert>
        </Snackbar>}
        {openErr &&<Snackbar open={openErr} autoHideDuration={8000} onClose={()=>handleEventClose}>
        <Alert onClose={handleEventClose} severity="error">
            {err}
        </Alert>
    </Snackbar>}
    <Paper
        style = {{
            padding:"25px",
            justifyContent:'center',
            alignItems:'center',
            background:"#05386B",
            color:"#EDF5E1",
            height: "620px"
        }}>
    <form onSubmit = {formik.handleSubmit}>
        <Grid container spacing = {2} style = {{
            marginTop: "10px"
        }}>
            
        <Grid container justifyContent = "center"  alignContent="center">
            <Typography variant = "h2" style = {{
                fontSize: "20px"
            }}>Sign Up</Typography>
        </Grid>

        <Grid item xs = { 12} >
            <Divider className = {style.divide} style = {{marginBottom:"30px"}}/>
        </Grid>
        <Grid item xs = { 12}>
            <TextField
                id = "userName"
                name = "userName"
                label = "User Name"
                type = "text"
                variant="outlined"
                className = {style.input}
                InputLabelProps = {{
                    className : style.label,                
                }}
            InputProps={{
            classes: {
                notchedOutline: style.notchedOutline,
                input : style.input
            }
            }}
            value={formik.values.userName}
            onChange = {formik.handleChange}
        />
        </Grid> 

        <Grid item xs = {12}>
        <TextField
            id = "userEmail"
            name = "userEmail"
            label = "Email"
            type = "text"
            variant="outlined"
            InputLabelProps = {{
                className : style.label,                
            }}
            InputProps={{
                classes: {
                    notchedOutline: style.notchedOutline,
                    input : style.input
                }
            }}
            value={formik.values.userEmail}
            onChange = {formik.handleChange}
            error={formik.touched.userEmail && Boolean(formik.errors.userEmail)}
            helperText={formik.touched.userEmail && formik.errors.userEmail}
        />
        </Grid>

        <Grid item xs = {12}>
        <TextField
            id = "userPassword"
            name = "userPassword"
            label = "Password"
            variant = "outlined"
            type = "password"
            value={formik.values.userPassword}
            onChange={formik.handleChange}
            InputProps = {{
                classes:{
                    notchedOutline: style.notchedOutline,
                    input:style.input
                }
            }}
            InputLabelProps = {{
                className: style.label
            }}
            error = {formik.touched.userPassword && Boolean(formik.errors.userPassword)}
            helperText = {formik.touched.userPassword && formik.errors.userPassword}/>
        </Grid>

        <Grid item xs = {12}>
        <TextField
            id = "passwordConfirmation"
            name = "passwordConfirmation"
            label = "Confirm Password"
            variant = "outlined"
            type = "password"
            value={formik.values.passwordConfirmation}
            onChange={formik.handleChange}
            InputProps = {{
                classes:{
                    notchedOutline: style.notchedOutline,
                    input:style.input
                }
            }}
            InputLabelProps = {{
                className: style.label
            }}
            error = {formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
            helperText = {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}></TextField>
        </Grid>

        <Grid item xs = {12}>
        <TextField
            id = "telephone"
            name = "telephone"
            label = "Telephone"
            variant = "outlined"
            type = "number"
            value={formik.values.telephone}
            onChange={formik.handleChange}
            InputProps = {{
                classes:{
                    notchedOutline: style.notchedOutline,
                    input:style.input
                }
            }}
            InputLabelProps = {{
                className: style.label
            }}
            error = {formik.touched.telephone && Boolean(formik.errors.telephone)}
            helperText = {formik.touched.telephone && formik.errors.telephone}
            ></TextField>
        </Grid>

        <Grid item xs = {8}>
        <TextField
            fullWidth
            select
            id = "role"
            name = "role"
            label = "Select your Role"
            variant = "outlined"
            value={formik.values.role}
            onChange={formik.handleChange}
            InputProps = {{
                classes:{
                    notchedOutline: style.notchedOutline,
                    input:style.input
                }
            }}
            InputLabelProps = {{
                className: style.label
            }}
            >
            {ROLES.map((role , index)=>(
                <MenuItem value={role} key = {index}>{role}</MenuItem>
            ))}</TextField>
        </Grid>

        <Grid container justifyContent = "center" alignContent="center" >
            <Button type = "submit" className = {style.button} size = "large">Sign Up</Button>
        </Grid>

        <Grid container justifyContent = "center" alignContent="center">
        <Link href="#/login" variant="body2" style = {{
                paddingTop: "20px",
                color:"#EDF5E1",
                fontSize:"16px"
            }} underline = "hover">            
        </Link>
        </Grid>
    </Grid>
    </form>
    </Paper>
    </Container>
    </div>
    ) 
}

export default RegisterView;