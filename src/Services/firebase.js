
import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyAgW5ABTB4nkutlxi_kPydH8cdzmICzq1Q",
    authDomain: "myapp-3dc12.firebaseapp.com",
    databaseURL: "https://myapp-3dc12.firebaseio.com",
    projectId: "myapp-3dc12",
    storageBucket: "myapp-3dc12.appspot.com",
    messagingSenderId: "640570443052",
    appId: "1:640570443052:web:c83a2793a42505b35d5889"
};

firebase.initializeApp(firebaseConfig)

export default firebase;