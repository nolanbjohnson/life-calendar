import React, { useState, useEffect } from 'react'
import AuthUserContext from './context'
import { withFirebase } from '../Firebase'

const withAuthentication = Component => {
	const withAuthentication = (props) => {
		const [authUser, setAuthUser] = useState(null)

		useEffect(() => {
			const listener = props.firebase.auth.onAuthStateChanged(authUser => {
		      authUser
		        ? setAuthUser(authUser)
		        : setAuthUser(null)
		    })

		    return listener
		}, []) // TODO I don't think the empty array is correct here - but don't know what state/props to include either

		console.log(authUser)
		
		return (
			<AuthUserContext.Provider value={ authUser }>
				<Component { ...props } /> 
			</AuthUserContext.Provider>
		)
	}

	return withFirebase(withAuthentication)
}

export default withAuthentication