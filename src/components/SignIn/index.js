import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { SignUpLink } from '../SignUp'
import { withFirebase } from '../../providers/Firebase'
import { AuthUserContext } from '../../providers/Session'
import { Form } from '../Utilities'
import * as ROUTES from '../../helpers/routes'

const SignInPage = () => (
  <div className="w-100 mw8 ph3 center">
    <h1>Sign In</h1>
    <SignInForm />
    <SignUpLink />
  </div>
)


const SignInFormBase = (props) => {
  const authUser = useContext(AuthUserContext)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    if (authUser) props.history.push(ROUTES.HOME)
  }, [authUser])

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setError(null)
  }

  const onSubmit = event => {
    props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('logging in!')
      })
      .catch(error => {
        setError(error);
      });
    event.preventDefault();
  };

  const isInvalid = password === '' || email === '';

  return (
    <Form.Form onSubmit={ onSubmit } style={{ overflow: "auto" }}>
      <Form.Section>
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

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase)

export default SignInPage

export { SignInForm }