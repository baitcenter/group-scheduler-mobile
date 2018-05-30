
import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyB3a1V-6UsqacHVp4U2p53h9I00inLsdYg",
    authDomain: "group-scheduling-mobile.firebaseapp.com",
    databaseURL: "https://group-scheduling-mobile.firebaseio.com",
    projectId: "group-scheduling-mobile",
    storageBucket: "group-scheduling-mobile.appspot.com",
    messagingSenderId: "313623904440"
}

firebase.initializeApp(config)

export default firebase
export const db = firebase.database()
export const auth = firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider();

