import React, { useState, useEffect } from 'react';
import firebase from './../../Services/firebase';
import { Link, useHistory } from 'react-router-dom';
import './Chat.css';
import ReactLoading from 'react-loading';
import LoginString from './../Login/LoginStrings';
import ChatBox from './../ChatBox/ChatBox';
import Welcome from './../Welcome/Welcome';

function Chat(props) {

    const {
        showToast
    }=props
    const history  = useHistory();

    const[loading, setLoading] = useState(true);
    const[isOpenDialog, setOpenDialogStatus] = useState(false);
    const[currentPeerUser, setCurrentPeerUser] = useState(null);
    const[currentUserName, setCurrentUserName] = useState('');
    const[currentUserID, setCurrentUserID] = useState('');
    const[currentUserPhotoURL, setCurrentUserPhotoURL] = useState('');
    const[contactNotification, setContactNotification] = useState([]);
    const[currentMessages, setCurrentMessages] = useState([]);
    const[currentDocumentId, setCurrentDocumentId] = useState("");
    const[searchUsers, setSearchUsers] = useState([]);
    const[displayedContacts, setDisplayedContacts] = useState([]);

    let notificationMessageErase = [];

    useEffect(() => {
        setCurrentUserName(localStorage.getItem(LoginString.Name));
        setCurrentUserID(localStorage.getItem(LoginString.ID));
        setCurrentUserPhotoURL(localStorage.getItem(LoginString.PhotoURL));
        setCurrentDocumentId(localStorage.getItem(LoginString.FirebaseDocumentId))
    }, []);

    useEffect(() => {
        if (currentDocumentId !== '') {
            getAllMessages();
        }
    }, [currentDocumentId]);

    useEffect(() => {
        getListUser();
    }, [currentUserID])

    const getAllMessages = () => {        
        firebase.firestore().collection('users').doc(currentDocumentId).get()
        .then((doc) => {
            const messages = [];
            doc.data().messages.map((item) => {
                messages.push({
                    notificationId: item.notificationId,
                    number: item.number
                });
            })
            setCurrentMessages(messages);
            setContactNotification(messages);
        });        
    }

    const getListUser = async () => {
        const result = await firebase.firestore().collection('users').get();
        if (result.docs.length > 0) {
            let listUsers = [];
            let searchUser = [];
            listUsers = [...result.docs];
            listUsers.forEach((item, index) => {
                if (item.data().id !== currentUserID) {
                    searchUser.push({
                        key: index,
                        documentKey: item.id,
                        id: item.data().id,
                        name: item.data().name,
                        messages: item.data().messages,
                        URL: item.data().URL,
                        description: item.data().description
                    });
                }
            });
            setSearchUsers(searchUser);
            setLoading(false);
        }
    };

    useEffect(() => {
        renderListUser();
    }, [searchUsers]);

    const renderListUser = () => {
        if(searchUsers.length > 0) {
            let viewListUser = [];
            let className = "";
            searchUsers.map((item) => {
                if(item.id !== currentDocumentId) {
                    className = getClassNameforUserNotification(item.id);
                    viewListUser.push(
                        <button 
                        id={item.id}
                        key={item.id}
                        className={className}
                        onClick = {() => {
                            notificcationErase(item.id)
                            setCurrentPeerUser(item)
                            setContactNotification(notificationMessageErase)
                            if (document.getElementById(item.key)) {
                                document.getElementById(item.key).style.backgroundColor = '#fff'
                                document.getElementById(item.key).style.color = '#fff'
                            }
                        }}
                        >
                        <img 
                            className="viewAvatarItem"
                            src={item.URL}
                            alt=""
                            placeholder = ""
                        />
                        <div className="viewWrapContentItem">
                            <span className="textItem">
                                {`Name : ${item.name}`}
                            </span>
                        </div>
                        { className === 'viewWrapItemNotification'
                        ? <div className="notificationpragraph">
                            <p id={item.key} className="newmessages">New Messages</p>
                        </div>
                        : null
                        }
                        </button>
                    )
                }
            })
            setDisplayedContacts(viewListUser);
        } else {
            console.log("No user is Present");
        }
    }

    const getClassNameforUserNotification = (itemId) => {
        let number = 0;
        let className = "";
        let check = false;
        if (currentPeerUser && currentPeerUser.id === itemId) {
            className = 'viewWrapItemFocused'
        } else {
            contactNotification.forEach((item) => {
                if (item.notificationId.length > 0) {
                    if (item.notificationId === itemId) {
                        check = true;
                        number = item.number;
                    }
                }
            });
            if (check === true) {
                className = 'viewWrapItemNotification';
            } else {
                className = 'viewWrapItem';
            }
        }
        return className;
    }

    const notificcationErase = (itemId) => {
        contactNotification.forEach((el) => {
            if (el.notificationId.length > 0) {
                if (el.notificationId !== itemId) {
                    notificationMessageErase.push(
                        {
                            notificationId: el.notificationId,
                            number: el.number
                        }
                    )
                }
            }
        });
        updaterenderList();
    }

    const updaterenderList = () => {
        firebase.firestore().collection('users').doc(currentDocumentId).update(
            {messages: notificationMessageErase}
        )
        setContactNotification(notificationMessageErase);
    }

    const logout = () => {
        firebase.auth().signOut();
        localStorage.clear();
        history.push('/');
    };

    const onProfileClick = () => {
        history.push('/profile');
    }

    const searchHandler = (event) => {
        let searchQuery = event.target.value.toLowerCase();
        let contacts = [];
        searchUsers.filter((el) => {
            if ( el.name !== null) {
                let searchValue = el.name.toLowerCase();
                if (searchValue.indexOf(searchQuery) !== -1) {
                    contacts.push(el);
                }
            }
        });
        if (searchQuery === '') {
            displayedSearchContacts(searchUsers);
        } else {
            displayedSearchContacts(contacts);
        }
    }

    const displayedSearchContacts = (contacts) => {
        if(contacts.length > 0) {
            let viewListUser = [];
            let className = "";
            contacts.map((item) => {
                if(item.id !== currentDocumentId) {
                    className = getClassNameforUserNotification(item.id);
                    viewListUser.push(
                        <button 
                        id={item.id}
                        key={item.id}
                        className={className}
                        onClick = {() => {
                            notificcationErase(item.id)
                            setCurrentPeerUser(item)
                            setContactNotification(notificationMessageErase)
                            if (document.getElementById(item.key)) {
                                document.getElementById(item.key).style.backgroundColor = '#fff'
                                document.getElementById(item.key).style.color = '#fff'
                            }
                        }}
                        >
                        <img 
                            className="viewAvatarItem"
                            src={item.URL}
                            alt=""
                            placeholder = ""
                        />
                        <div className="viewWrapContentItem">
                            <span className="textItem">
                                {`Name : ${item.name}`}
                            </span>
                        </div>
                        { className === 'viewWrapItemNotification'
                        ? <div className="notificationpragraph">
                            <p id={item.key} className="newmessages">New Messages</p>
                        </div>
                        : null
                        }
                        </button>
                    )
                }
            })
            setDisplayedContacts(viewListUser);
        } else {
            setDisplayedContacts([]);
            console.log("No user is Present");
        }
    }

    return (
        <div className="root">
            <div className="body">
                <div className="viewListUser">
                    <div className="profileviewleftside">
                        <img className="ProfilePicture" alt="" src={currentUserPhotoURL}
                            onClick={onProfileClick}
                        />
                        <button className="Logout" onClick={logout}>Logout</button>
                    </div>

                    <div className="rootsearchbar">
                        <div className="input-container">
                            <i className="fa fa-search icon"></i>
                            <input 
                                className="input-field"
                                type="text"
                                onChange={searchHandler}
                                placeholder="Search"
                            />
                        </div>
                    </div>
                    
                    {displayedContacts}
                </div>
                <div className="viewBoard">
                    {
                        currentPeerUser
                        ? 
                        <ChatBox
                            currentPeerUser={currentPeerUser}
                            showToast={showToast}
                        ></ChatBox>
                        :
                        <Welcome
                        currentUserPhoto={currentUserPhotoURL}
                        currentUserName={currentUserName}
                        ></Welcome>
                    }
                </div>
            </div>
        </div>
    )
}

export default Chat;