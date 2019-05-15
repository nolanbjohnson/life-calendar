import React from 'react'
import ReactDOM from 'react-dom'
import { render } from 'react-testing-library'
import firebase from '../../providers/Firebase'
import App from '../App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})

// beforeAll(function () {
//   firebase.onAuthUserListener = jest.fn(async () => {
//     return {
//       ok: true,
//       json: function () {
//         return {
//           "uid": "M7PZxGOvnghWd78u0RqfAKE1b5F2",
//           "email": "nolanbjohnson@gmail.com",
//           "birthdate": "1985-11-03",
//           "onboardingCompleted": 1557861524998,
//           "roles": {
//             "admin": "admin"
//           },
//           "username": "nolj"
//         }
//       }
//     };
//   });
// });

// const Hello = () => <h1>Hello World</h1>
// test('first hello test', () => {
//   const { container } = render(<Hello />);

//   expect(container).toHaveTextContent('Hello World');
// });