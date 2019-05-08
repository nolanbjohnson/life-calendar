import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { SignUpLink } from '../SignUp'
import { withFirebase } from '../Firebase'
import { AuthUserContext } from '../Session'
import { Form, FormSection, FormLabel, FormInput, FormSubmit } from '../FormElements'
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
    <Form onSubmit={ onSubmit } style={{ overflow: "auto" }}>
      <FormSection>
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

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase)

export default SignInPage

export { SignInForm }