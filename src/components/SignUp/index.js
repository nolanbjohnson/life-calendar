import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose'

import { withFirebase } from '../../providers/Firebase';
import { Form, FormSection, FormLabel, FormInput, FormSubmit } from '../Utilities'

import * as ROUTES from '../../helpers/routes';
import * as ROLES from '../../helpers/roles';

// following this tutorial for firebase: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
// implementing with Hooks

const SignUpPage = () => (
  <div className="w-100 mw8 ph3 center">
    <h2>Sign Up</h2>
      <SignUpForm />
  </div>
)

// TODO create a test to check that the form inputs work and that incorrect inputs won't create a user and instead show error
const SignUpFormBase = (props) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState(null)

  const resetForm = () => {
    setUsername("")
    setEmail("")
    setPassword("")
    setPasswordConfirmation("")
    setIsAdmin(false)
    setError(null)
  }

  // TODO try refactoring to use async and await instead (how do you do catch?)
  const onSubmit = event => {
    if(isInvalid) return // submit should be disabled but check anyway

    console.log('submitting form:', event.target)

    let roles = {}
    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN
    }
    props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
            roles
          })
        console.log(authUser)

        resetForm()
        props.history.push(ROUTES.ONBOARDING)
      })
      .catch(error => {
        console.log(error)
        setError(error)
      })

    event.preventDefault()
  }

  const isInvalid =
        password !== passwordConfirmation ||
        password === '' ||
        email === '' ||
        username === ''

  return (
    <Form.Form onSubmit={ onSubmit } style={{ overflow: "auto" }}>
      <Form.Section>
        <Form.Label 
          htmlFor="username"
        >
          User Name
        </Form.Label>
        <Form.Input 
          name="username" 
          type="text" 
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <Form.Label 
          htmlFor="email"
        >
          Email
        </Form.Label>
        <Form.Input 
          name="email" 
          type="text" 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <Form.Label 
          htmlFor="password"
        >
          Password
        </Form.Label>
        <Form.Input 
          name="password" 
          type="password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Form.Label 
          htmlFor="passwordConfirmation"
        >
          Password Confirmation
        </Form.Label>
        <Form.Input 
          name="passwordConfirmation" 
          type="password" 
          value={passwordConfirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
        />
        <Form.Label>
          Admin
        <input 
          name="isAdmin" 
          type="checkbox" 
          checked={isAdmin}
          onChange={e => setIsAdmin(e.target.checked)}
          className="mh1"
        />
        </Form.Label>
      </Form.Section>
      <Form.Submit 
        type="submit" 
        value="Submit"
        disabled={isInvalid}
      />
      {error && <p>{error.message}</p>}
    </Form.Form>
  )
}

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase)

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGNUP}>Sign Up</Link>
  </p>
)

export default SignUpPage

export { SignUpForm, SignUpLink }