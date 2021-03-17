import firebase from 'firebase'
// import 'firebase/auth'

var firebaseConfig = {
  // apiKey: "AIzaSyCIuIphNNwPVkE-Bn7RwgLOyVjwQuqJMpA",
  // authDomain: "godtasker-development.firebaseapp.com",
  // projectId: "godtasker-development",
  // storageBucket: "godtasker-development.appspot.com",
  // messagingSenderId: "575266640627",
  // appId: "1:575266640627:web:7dd435af15714532cc9d86"

  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

firebase.initializeApp(firebaseConfig);

export default firebase
