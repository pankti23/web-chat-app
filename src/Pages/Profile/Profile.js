import React, { useState, useEffect, useRef } from 'react';
import firebase from './../../Services/firebase';
import { Link, useHistory } from 'react-router-dom';
import './Profile.css';
import ReactLoading from 'react-loading';
import LoginString from './../Login/LoginStrings';
import 'react-toastify/dist/ReactToastify.css';
import images from './../../ProjectImages/ProjectImages';

const Profile = (props) => { 

    const {
        showToast
    }=props

    const history  = useHistory();

    const refInput = useRef(null);
    
    const[loading, setLoading] = useState(false);
    const[documentKey, setDocumentKey] = useState('');
    const[userName, setUserName] = useState('');
    const[userID, setUserID] = useState('');
    const[aboutMe, setAboutMe] = useState('');
    const[userPhotoURL, setUserPhotoURL] = useState('');
    const[newPhoto, setNewPhoto] = useState('');

    // let newPhoto = null;
    let newPhotoUrl = "";

    useEffect(() => {
        setDocumentKey(localStorage.getItem(LoginString.FirebaseDocumentId))
        setUserID(localStorage.getItem(LoginString.ID));
        setUserName(localStorage.getItem(LoginString.Name));
        setAboutMe(localStorage.getItem(LoginString.Description));
        setUserPhotoURL(localStorage.getItem(LoginString.PhotoURL));

        if (!localStorage.getItem(LoginString.ID)) {
            history.push('/');
        }
    }, []);

    const onChangeAvatar = (event) => {
        if (event.target.files && event.target.files[0]) {
            const preFixFileType = event.target.files[0].type.toString();
            if (preFixFileType.indexOf(LoginString.PREFIX_IMAGE) !== 0) {
                showToast(0, 'This file is not an image');
                return;
            }
            setNewPhoto(event.target.files[0]);
            setUserPhotoURL(URL.createObjectURL( event.target.files[0]))
        } else {
            showToast(0, 'Something wrong with input file');
        }
    }

    const onChangeNickname= (event) => {
        setUserName(event.target.value);
    }

    const onChangeAboutMe = (event) => {
        setAboutMe(event.target.value);
    }

    const uploadAvatar = () => {
        setLoading(true);
        if (newPhoto) {
            const uploadtask = firebase.storage()
            .ref()
            .child(userID)
            .put(newPhoto) 

            uploadtask.on(
                LoginString.UPLOAD_CHANGED,
                null,
                err => {
                    showToast(0, err.message);
                },
                () => {
                    uploadtask.snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                        updateUserInfo(true, downloadURL)
                    })
                }
            )
        } else {
            updateUserInfo(false, null)
        }
    }

    const updateUserInfo = (isUpdated, downloadURL) => {
        let newinfo;

        if (isUpdated) {
            newinfo = {
                name: userName,
                description: aboutMe,
                URL: downloadURL
            }
        } else {
            newinfo = {
                name: userName,
                description: aboutMe
            }  
        }

        firebase.firestore().collection('users')
        .doc(documentKey)
        .update(newinfo)
        .then(data => {
            localStorage.setItem(LoginString.Name, userName);
            localStorage.setItem(LoginString.Description, aboutMe);
            if (isUpdated) {
                localStorage.setItem(LoginString.PhotoURL, downloadURL);
            }
            setLoading(false);
            showToast(1, 'Update info success');
        });
    }

    return( 
        <div className="profileroot">
            <div className="headerprofile">
                <span>PROFILE</span>
            </div>
            <img className="avatar" alt="" src={userPhotoURL} />

            <div className="viewWrapInputFile">
                <img 
                    className="imgInputFile"
                    alt=""
                    src={images.camera}
                    onClick = {() => {
                        refInput.current.click()
                    }}
                />
                <input 
                    ref = {refInput}
                    accept = "image/*"
                    className="viewInputFile"
                    type="file"
                    onChange={onChangeAvatar}
                />
            </div>
            <span className="textLabel">Name</span>
            <input 
              className="textInput"
              value={userName}
              placeholder="Your nickname..."
              onChange={onChangeNickname}
            />

            <span className="textLabel">About Me</span>
            <input 
              className="textInput"
              value={aboutMe}
              placeholder="Tell about yourself..."
              onChange={onChangeAboutMe}
            />

            <div>
                <button className="btnUpdate" onClick={uploadAvatar}>SAVE</button>
                <button className="btnback" onClick={() => {
                    history.push('/chat')
                }}>BACK</button>
            </div>

            {
                loading === true
                ?
                <ReactLoading 
                    type={'spin'}
                    color={'#203152'}
                    height={'3%'}
                    width={'3%'}
                /> 
                :null
            }
        </div>
    )

}

export default Profile;