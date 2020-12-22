import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Login.css';
import firebase from './../../Services/firebase';
import CssBaseLine from '@material-ui/core/CssBaseLine';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

// import LockOutlinedIcon from '@material-ui/icons/LockOutlinedIcon';


import { Card } from 'react-bootstrap';
import LoginString from './../Login/LoginStrings';

const Login = (props) => { 

    const {
        showToast
    }=props
    const paper = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingLeft: '10px',
        paddingRight: '10px',
    }

    const rightComponent = {
        boxShadow: '0 5px 5px #808888',
        backgroundColor: 'smokegrey'
    }

    const root = {
       height: '100vh',
       background: "linear-gradient(90deg, #e3ffe7 0%, $d9etff 100%)",
       marginBottom: '50px'
    }

    const Signinsee = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
        backgroundColor: '#1ebea5',
        width: '100%',
        boxShadow: '0 5px 5px #808888',
        height: "10rem",
        paddingTop: '48px',
        opacity: '0.5',
        borderBottom: '5px solid green'
    }

    const form = {
        width: '100%',
        marginTop: '50px'
    }

    const avatar = {
        backgroundColor: 'green'
    }
    
    const[isLoading, setLoading] = useState(true);
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');  
    const[error, setError] = useState(null); 

    const history  = useHistory();

    useEffect(() => {
        if (localStorage.getItem(LoginString.ID)) {
            setLoading(false);
            showToast(1, 'Login success');
            history.push('/chat');
        } else {
            setLoading(false);
        }
    }, [])
    
    const handleChange = (event) => {
        if (event.target.name === 'email') {
            setEmail(event.target.value)
        }
        if (event.target.name === 'password') {
            setPassword(event.target.value)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(async result => {
                 let user = result.user;
                 if (user) {
                    await firebase.firestore().collection('users')
                    .where('id', "==", user.uid)
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            const currentdata = doc.data();
                            console.log(currentdata);
                            localStorage.setItem(LoginString.FirebaseDocumentId, doc.id);
                            localStorage.setItem(LoginString.ID, currentdata.id);
                            localStorage.setItem(LoginString.Name, currentdata.name);
                            localStorage.setItem(LoginString.Email, currentdata.email);
                            localStorage.setItem(LoginString.Password, currentdata.password);
                            localStorage.setItem(LoginString.PhotoURL, currentdata.URL);                            
                            localStorage.setItem(LoginString.Description, currentdata.description);
                        })
                    }) 
                    history.push('/chat');
                 }
            }).catch(function(error) {
                setError('Error while signing in please try again');
                // document.getElementById('1').innerHTML('Incorret email/password or poor internet')
            })
        
    }
    
    return(
        <Grid container component="main" style={root}>
            <CssBaseLine></CssBaseLine>
            <Grid item xs={1} sm={4} md={7} className="image">
            <div className="image1"></div>
            </Grid>
            <Grid item xs={12} sm={8} md={5} style={rightComponent} elevation={6} square>
                <Card style={Signinsee}>
                    <div>
                        <Avatar style={avatar}></Avatar>
                    </div>
                    <div>
                        <Typography component="h1" variant='h5'>
                            Sign in 
                            To
                        </Typography>
                    </div>
                    <div>
                        <Link to="/">
                            <button class="btn">
                                <i className="fa fa-home"></i>
                                WebChat
                            </button>
                        </Link>
                    </div>
                </Card>

                <div style={paper}>
                    <form style={form} noValidate onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleChange}
                            value={email}
                        ></TextField>

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="password"
                            onChange={handleChange}
                            value={password}
                        ></TextField>

                        <Typography component="h6" variant="h5">
                            {
                                error
                                ? <p className="text-danger">{error}</p>
                                : null
                            }
                        </Typography>

                        <div className="CenterAliningItems">
                            <button className="button1" type="submit">
                                <span>Login In</span>
                            </button>
                        </div>

                        <div className="CenterAliningItems">
                            <p>Don't have an account?</p>
                            <Link to="/signup" variant="body2">Sign Up</Link>
                        </div>
                        <div className="error">
                            <p id="1" style={{color: 'red'}}></p>
                        </div>
                    </form>
                </div>
            </Grid>
        </Grid>
    )

}

export default Login;