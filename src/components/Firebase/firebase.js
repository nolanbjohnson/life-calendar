import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

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
    this.db = app.database()
    this.serverValue = app.database.ServerValue
  }

  doCreateUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => {
    console.log('signing out')
    this.auth.signOut()
  }

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .on('value', snapshot => {
            const dbUser = snapshot.val()

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            }

            next(authUser)
          })
      } else {
        fallback()
      }
    })

  user = uid => this.db.ref(`users/${uid}`)

  users = () => this.db.ref('users')

  event = (uid) => this.db.ref(`events/${uid}`)

  events = () => this.db.ref('events')
  
  userEvents = (userId) => this.db.ref('events').orderByChild('userId').equalTo(userId)
}

export default Firebase