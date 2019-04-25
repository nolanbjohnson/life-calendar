import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database';

// following this tutorial for firebase: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/

const config = {
  	apiKey: "AIzaSyDrbrjr4n3NaecU__BkBg8E3MIHxwiKKNM",
	authDomain: "the-life-calendar.firebaseapp.com",
	databaseURL: "https://the-life-calendar.firebaseio.com",
	projectId: "the-life-calendar",
	storageBucket: "the-life-calendar.appspot.com",
	messagingSenderId: "88550625183"
}

class Firebase {
  constructor() {
    app.initializeApp(config)

    this.auth = app.auth()
    this.db = app.database();
  }

  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => {
    console.log('signing out')
    this.auth.signOut()
  }

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)

  events = () => this.db.ref('events')

}

export default Firebase