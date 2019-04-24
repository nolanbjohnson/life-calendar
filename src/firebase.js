import app from 'firebase/app'

// following this tutorial for firebase: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/

const config = {
  	apiKey: "AIzaSyDrbrjr4n3NaecU__BkBg8E3MIHxwiKKNM",
	authDomain: "the-life-calendar.firebaseapp.com",
	databaseURL: "https://the-life-calendar.firebaseio.com",
	projectId: "the-life-calendar",
	storageBucket: "the-life-calendar.appspot.com",
	messagingSenderId: "88550625183"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
  }
}

export default Firebase;