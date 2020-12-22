import React, {useState , useEffect, useRef} from 'react';
import './ChatBox.css';
import { Card } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';
import firebase from './../../Services/firebase';
import images from './../../ProjectImages/ProjectImages';
import moment from 'moment';
import LoginString from './../Login/LoginStrings';
import 'bootstrap/dist/css/bootstrap.min.css';


const ChatBox = (props) => { 

    const {
        showToast,
        currentPeerUser
    }=props

    const messageEnd = useRef(null);
    const refInput = useRef(null);

    const[loading, setLoading] = useState(false);
    const[isShowStiker, setShowStiker] = useState(false);
    const[currentUserName, setCurrentUserName] = useState('');
    const[currentUserPhotoURL, setCurrentUserPhotoURL] = useState('');
    const[currentUserID, setCurrentUserID] = useState('');
    const[currentDocumentId, setCurrentDocumentId] = useState("");
    const[stateChanged, setStateChanged] = useState("");
    const[inputvalue, setInputValue] = useState("");
    const[groupChatId, setGroupChatId] = useState(null);
    const[currentPeerUserMessages, setCurrentPeerUserMessages] = useState([]);
    const[removeListener, setRemoveListener] = useState(null);
    const[currentPhotoFile, setCurrentPhotoFile] = useState(null);
    const[listMessages, setListMessages] = useState([]);

    useEffect(() => {
        setCurrentUserName(localStorage.getItem(LoginString.Name));
        setCurrentUserID(localStorage.getItem(LoginString.ID));
        setCurrentUserPhotoURL(localStorage.getItem(LoginString.PhotoURL));
        setCurrentDocumentId(localStorage.getItem(LoginString.FirebaseDocumentId))
        setStateChanged(localStorage.getItem(LoginString.UPLOAD_CHANGED))       
    }, []);

    useEffect(() => {
        setShowStiker(false);
        scrollToBottom();
        console.log(currentPeerUser);
        firebase.firestore().collection('users').doc(currentPeerUser.documentKey).get()
        .then((docRef) => {
            setCurrentPeerUserMessages(docRef.data().messages);
        });
        getListHistory(); 
    }, [currentPeerUser]);

    useEffect(() => {
        console.log('currentPeerUserMessages', currentPeerUserMessages);
    }, [currentPeerUserMessages])


    const scrollToBottom = () => {
        if (messageEnd) {
            messageEnd.current.scrollIntoView({});
        }

    }   

    useEffect(() => {
        console.log('groupChatId', groupChatId)
        if (groupChatId !== null) {
            let listMessageData = [];

            firebase.firestore().collection('Messages')
            .doc(groupChatId)
            .collection(groupChatId)
            .onSnapshot(snapshot => {
                console.log(snapshot);
                snapshot.docChanges().forEach(change => {
                    console.log(change)
                    if (change.type === LoginString.DOC) {
                        listMessageData.push(change.doc.data())
                    }
                })
                setListMessages(listMessageData);
                setLoading(false);
            }
            )

            // let removeListenerData = 
                
                // setRemoveListener(removeListenerData);
        }
    }, [groupChatId]);

    useEffect(() => {
        getListHistory(); 
    }, [currentUserID]);


    const getListHistory = () => {
        if (currentUserID && currentPeerUser.id) {
            if (listMessages.length = 0 ){
                setLoading(true);
            }
            if (
                    hashString(currentUserID) <= hashString(currentPeerUser.id)
            ) {
                setGroupChatId(`${currentUserID}-${currentPeerUser.id}`)
            } else {
                    setGroupChatId(`${currentPeerUser.id}-${currentUserID}`)
            }
        }

    }

    const hashString = (str) => {
        let hash = 0;
        for (let i = 0; i <  str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash
        }
        return hash;
    }

    const renderSticker = () => {
        return (
            <div className="viewStickers">
                <img 
                    className="imgSticker"
                    src={images.icon1}
                    alt="sticker"
                    onClick={() => onSendMessage('icon1', 2)}
                />
                <img 
                    className="imgSticker"
                    src={images.icon2}
                    alt="sticker"
                    onClick={() => onSendMessage('icon2', 2)}
                />
                <img 
                    className="imgSticker"
                    src={images.icon3}
                    alt="sticker"
                    onClick={() => onSendMessage('icon3', 2)}
                />
                <img 
                    className="imgSticker"
                    src={images.icon4}
                    alt="sticker"
                    onClick={() => onSendMessage('icon4', 2)}
                />
                <img 
                    className="imgSticker"
                    src={images.icon5}
                    alt="sticker"
                    onClick={() => onSendMessage('icon5', 2)}
                />
                <img 
                    className="imgSticker"
                    src={images.icon6}
                    alt="sticker"
                    onClick={() => onSendMessage('icon6', 2)}
                />
                <img 
                    className="imgSticker"
                    src={images.icon7}
                    alt="sticker"
                    onClick={() => onSendMessage('icon7', 2)}
                />
                <img 
                    className="imgSticker"
                    src={images.icon7}
                    alt="sticker"
                    onClick={() => onSendMessage('icon7', 2)}
                />

            </div>
        )
    }

    const onSendMessage = (content, type) => {
        let notifictaionMessage = [];
        if (isShowStiker && type === 2) {

        }

        if (content.trim() === '') {
            return;
        }

        const timestamp = moment().valueOf().toString()

        const itemMessage = {
            idFrom: currentUserID,
            idTo: currentPeerUser.id,
            timestamp: timestamp,
            content: content.trim(),
            type: type
        }

        firebase.firestore()
        .collection('Messages')
        .doc(groupChatId)
        .collection(groupChatId)
        .doc(timestamp)
        .set(itemMessage)
        .then(() => {
            setInputValue('');
        })

        currentPeerUserMessages.map((item) => {
            if (item.notificationId !== currentUserID) {
                notifictaionMessage.push(
                    {
                        notifictaionId: item.notifictaionId,
                        number: item.number 
                    }
                )
            }
        })

        if (currentPeerUserMessages.length === 0) {
            notifictaionMessage.push(
                {
                    notifictaionId: currentPeerUser.id,
                    number: 0 
                }
            )
        }

        firebase.firestore()
        .collection('users')
        .doc(currentPeerUser.documentKey)
        .update({
            messages: notifictaionMessage
        })
        .then((data) => {})
        .catch(err => {
            showToast(0, err.toString())
        })

    }

    const onKeyPress = (event) => {
        if (event.key === 'enter') {
            onSendMessage(inputvalue, 0)
        }
    }

    const openListSticker = () => {
        setShowStiker(!isShowStiker)
    }

    const onChoosePhoto = (event) => {
        if (event.target.files && event.target.files[0]) {
            setLoading(true);
            const preFixFileType = event.target.files[0].type.toString();
            if (preFixFileType.indexOf(LoginString.PREFIX_IMAGE) !== 0) {
                showToast(0, 'This file is not an image');
                setLoading(false)
                // return;
            } else {
                setCurrentPhotoFile(event.target.files[0]);
                
            }
        } else {
            setLoading(false);
            showToast(0, 'Something wrong with input file');
        }
    }

    useEffect(() => {
        uploadPhoto();
    }, [currentPhotoFile]);

    const uploadPhoto = () => {
        console.log(currentPhotoFile);
        if (currentPhotoFile) {
            const timestamp = moment()
            .valueOf()
            .toString()

            const uploadtask = firebase.storage()
            .ref()
            .child(timestamp)
            .put(currentPhotoFile) 

            uploadtask.on(
                LoginString.UPLOAD_CHANGED,
                null,
                err => {
                    setLoading(false);
                    showToast(0, err.message);
                },
                () => {
                    uploadtask.snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                        setLoading(false);
                        onSendMessage(downloadURL, 1)
                    })
                }
            )
        }
    }

    const isLastMessageLeft = (index) => {
        if (
            (index + 1 < listMessages.length && listMessages[index+1].idFrom === currentUserID) ||
            index === listMessages.length - 1
        ) {
            return true;
        } else {
            return false;
        }
    }

    const isLastMessageRight = (index) => {
        if (
            (index + 1 < listMessages.length && listMessages[index+1].idFrom !== currentUserID) ||
            index === listMessages.length - 1
        ) {
            return true;
        } else {
            return false;
        }
    }

    const getGifImage = (value) => {
        switch (value) {
            case 'icon1': 
                return images.icon1;
            case 'icon2': 
                return images.icon2;
            case 'icon3': 
                return images.icon3;
            case 'icon4': 
                return images.icon4;
            case 'icon5': 
                return images.icon5;
            case 'icon6': 
                return images.icon6;
            case 'icon7': 
                return images.icon7;
            case 'icon8': 
                return images.icon8;
            default:
                return images.icon8;
        }
    }

    const renderListMessages = () => {
        if (listMessages.length > 0) {
            let viewListMessages = [];
            listMessages.forEach((item, index) => {
                if (item.idFrom === currentUserID) {
                    if (item.type === 0) {
                        viewListMessages.push(
                            <div className="viewItemRight" key={item.timestamp}>
                                <span className="textContentItem">{item.content}</span>
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessages.push(
                            <div className="viewItemRight2" key={item.timestamp}>
                                <img 
                                    className="imgItemRight"
                                    src={item.content}
                                    alt="Please update your image"
                                />
                            </div>
                        )
                    } else {
                        viewListMessages.push(
                            <div className="viewItemRight3" key={item.timestamp}>
                                <img 
                                    className="imgItemRight"
                                    src={getGifImage(item.content)}
                                    alt="content message"
                                />
                            </div>
                        )
                    }
                }  else {
                    if (item.type === 0) {
                        viewListMessages.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {isLastMessageLeft(index) ? (
                                        <img 
                                            src={currentPeerUser.URL}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                        ):
                                        <div className="viewPaddingLeft"></div>
                                    }
                                    <div className="viewItemLeft">
                                        <span className="textContentItem">{item.content}</span>
                                    </div>
                                </div>
                                {
                                    isLastMessageLeft(index) ? 
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            {moment(Number(item.timestamp)).format('11')}
                                        </div>
                                    </span>
                                    : null
                                }
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessages.push(
                            <div className="viewWrapItemLeft3" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {isLastMessageLeft(index) ? (
                                        <img 
                                            src={currentPeerUser.URL}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                        ):
                                        <div className="viewPaddingLeft"></div>
                                    }
                                    <div className="viewItemLeft2">
                                        <img 
                                            className="imgItemLeft"
                                            src={item.content}
                                            alt="Please update your image"
                                        />
                                    </div>
                                </div>
                                {
                                    isLastMessageLeft(index) ? 
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            {moment(Number(item.timestamp)).format('11')}
                                        </div>
                                    </span>
                                    : null
                                }
                            </div>
                        )
                    } else {
                        viewListMessages.push(
                            <div className="viewWrapItemLeft3" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {isLastMessageLeft(index) ? (
                                        <img 
                                            src={currentPeerUser.URL}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                        ):
                                        <div className="viewPaddingLeft"></div>
                                    }
                                    <div className="viewItemLeft3" key={item.timestamp}>
                                    <img 
                                        className="imgItemLeft"
                                        src={getGifImage(item.content)}
                                        alt="content message"
                                    />
                                    </div>
                                </div>
                                {
                                    isLastMessageLeft(index) ? 
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            {moment(Number(item.timestamp)).format('11')}
                                        </div>
                                    </span>
                                    : null
                                }
                            </div>
                        )
                    }
                }
            })
            return viewListMessages;
        } else {
            return (
                <div className="viewWrapSayHi">
                    <span className="textSayHi">Say hi to new friend</span>
                </div>
            )
        }
    }

    return (
       <Card className="viewChatBoard">
            <div className="headerChatBoard">
                <img 
                    className="viewAvatarItem"
                    src={currentPeerUser.URL}
                    alt=""
                />
                <span className="textHeaderChatBoard">
                    <p style={{fontSize: '20px'}}>{currentPeerUser.name}</p>
                </span>
                <div className="aboutme">
                    <span>
                        <p>{currentPeerUser.description}</p>
                    </span>
                </div>
            </div>

            <div className="viewListContentChat">
                {renderListMessages()}
                <div style={{float: 'left', clear:'both'}} ref={messageEnd}>
                    
                </div>
            </div>

            {
                isShowStiker
                ? renderSticker()
                : null
            }

            <div className="viewBottom">
                <img 
                    className="icOpenGallery"
                    src={images.gallery}
                    alt=""
                    onClick = {() => refInput.current.click()}
                />

                <input
                    className="viewInputGallery"
                    accept="images/*"
                    type="file"
                    ref={refInput}
                    onChange={onChoosePhoto}
                />

                <img 
                    className="icOpenSticker"
                    src={images.icons}
                    alt=""
                    onClick={openListSticker}
                />

                <input 
                    className="viewInput"
                    placeholder="Type a message"
                    value={inputvalue}
                    onChange={event => {
                        setInputValue(event.target.value)
                    }}
                    onKeyPress = {onKeyPress}
                />

                <img 
                    className="icSend"
                    src={images.send}
                    alt="send"
                    onClick={() => onSendMessage(inputvalue, 0)}
                />
            </div>
            {
                loading
                ?
                <div className="viewLoading">
                    <ReactLoading 
                        type={'spin'}
                        color={'#203152'}
                        height={'3%'}
                        width={'3%'}
                    />
                </div>
                : null
            }
       </Card>
    )

}

export default ChatBox;