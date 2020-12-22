import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Signup.css';
import firebase from './../../Services/firebase';
import CssBaseLine from '@material-ui/core/CssBaseLine';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import { Card } from 'react-bootstrap';
import LoginString from './../Login/LoginStrings';

const SignUp = (props) => { 
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
    const[email, setEmail] = useState('');
    const[name, setName] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState(null);

    const history  = useHistory();

    const handleChange = (event) => {
        if (event.target.name === 'email') {
            setEmail(event.target.value)
        }
        if (event.target.name === 'name') {
            setName(event.target.value)
        }
        if (event.target.name === 'password') {
            setPassword(event.target.value)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        try{
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async result => {
                firebase.firestore().collection('users')
                .add({
                    name,
                    id: result.user.uid,
                    email,
                    password,
                    URL: '',
                    messages: [{notificationId: "", number: 0}],
                    description: ''
                }).then((docRef) => {
                    localStorage.setItem(LoginString.ID, result.user.uid);
                    localStorage.setItem(LoginString.name, name);
                    localStorage.setItem(LoginString.email, email);
                    localStorage.setItem(LoginString.password, password);
                    localStorage.setItem(LoginString.PhotoURL, "");
                    localStorage.setItem(LoginString.UPLOAD_CHANGED, "state_changed");
                    localStorage.setItem(LoginString.Description, "");
                    localStorage.setItem(LoginString.FirebaseDocumentId, docRef.id);
                    setEmail('');
                    setName('');
                    setPassword('');
                    history.push('/chat');
                })
                .catch((error) => {
                    console.error(error);
                });
            })
        }
        catch(error){
            document.getElementById('1').innerHTML = 'Error in signing up please try later';
        }
    }

    return(
        <div>
            <CssBaseLine></CssBaseLine>
            <Card style={Signinsee}>
                <div>
                    <Typography component="h1" variant="h5">
                        Sign Up
                        To
                    </Typography>
                </div>
                <div>
                    <Link to="/">
                    <button className="btn"><i className="fa fa-home"></i>WebChat</button>
                    </Link>
                </div>
            </Card>
            <Card className="formacontrooutside">
                <form className="customform" noValidate onSubmit={handleSubmit}>
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

                    <div>
                        <p style={{color:'grey', fontSize: '15px', marginLeft:'0'}}>
                            Password: length Greater than 6 (alphabet, number, special charcter)
                        </p>
                    </div>

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

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"  
                        autoComplete="name"
                        onChange={handleChange}
                        value={name}
                    ></TextField>

                    <div>
                        <p style={{color:'grey', fontSize: '15px'}}>
                            Please fill all fields and password shpuld be greater than 6
                        </p>
                    </div>

                    <div className="CenterAliningItems">
                        <button className="button1" type="submit">
                            <span>Sign Up</span>
                        </button>
                    </div>

                    <div>
                        <p style={{color: 'grey'}}>Already have an account?</p>
                        <Link to="/login">Login In</Link>
                    </div>

                    <div className="error">
                        <p id="1" style={{color: 'red'}}></p>
                    </div>

                </form>
            </Card>
        </div>
    )
}

export default SignUp;