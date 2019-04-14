import firebase from 'firebase'

const config = {
  	apiKey: "AIzaSyDrbrjr4n3NaecU__BkBg8E3MIHxwiKKNM",
	authDomain: "the-life-calendar.firebaseapp.com",
	databaseURL: "https://the-life-calendar.firebaseio.com",
	projectId: "the-life-calendar",
	storageBucket: "the-life-calendar.appspot.com",
	messagingSenderId: "88550625183"
};
firebase.initializeApp(config);

export default firebase;