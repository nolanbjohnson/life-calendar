import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose'

import { withFirebase } from '../Firebase';
import { Form, FormSection, FormLabel, FormInput, FormSubmit } from '../FormElements'

import * as ROUTES from '../../helpers/routes';

// following this tutorial for firebase: https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/
// implementing with Hooks

const SignUpPage = () => (
  <div className="w-100 mw8 ph3 center">
    <h2>SignUp</h2>
      <SignUpForm />
  </div>
)

// TODO create a test to check that the form inputs work and that incorrect inputs won't create a user and instead show error
const SignUpFormBase = (props) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState(null)

  const resetForm = () => {
    setUsername("")
    setEmail("")
    setPassword("")
    setPasswordConfirmation("")
    setError(null)
  }

  // TODO try refactoring to use async and await instead (how do you do catch?)
  const onSubmit = event => {
    if(isInvalid) return // submit should be disabled but check anyway

    console.log('submitting form:', event.target)
    props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        console.log(authUser)
        resetForm()
        props.history.push(ROUTES.HOME)
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
    <Form onSubmit={ onSubmit } style={{ overflow: "auto" }}>
      <FormSection>
        <FormLabel 
          htmlFor="username"
        >
          User Name
        </FormLabel>
        <FormInput 
          name="username" 
          type="text" 
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <FormLabel 
          htmlFor="email"
        >
          Email
        </FormLabel>
        <FormInput 
          name="email" 
          type="text" 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <FormLabel 
          htmlFor="password"
        >
          Password
        </FormLabel>
        <FormInput 
          name="password" 
          type="password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <FormLabel 
          htmlFor="passwordConfirmation"
        >
          Password Confirmation
        </FormLabel>
        <FormInput 
          name="passwordConfirmation" 
          type="password" 
          value={passwordConfirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
        />
      </FormSection>
      <FormSubmit 
        type="submit" 
        value="Submit"
        disabled={isInvalid}
      />
      {error && <p>{error.message}</p>}
    </Form>
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