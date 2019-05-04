import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { withFirebase } from '../Firebase'
import AuthUserContext from './context'

import * as ROUTES from '../../helpers/routes'

// this structure means it's called like this: withAuthorization(condition)(Component)
const withAuthorization = condition => Component => { 

	const withAuthorization = props => {

		useEffect(() => {
			const listener = props.firebase.onAuthUserListener(
				authUser => {
			      	if(!condition(authUser)) {
			      		props.history.push(ROUTES.SIGNIN)
			      	}
			    }, 
			    () => props.history.push(ROUTES.SIGNIN)
		    )
		      
		    return listener
		}, []) // TODO I don't think the empty array is correct here - but don't know what state/props to include either

		return (
			<AuthUserContext.Consumer>
			{ 
				authUser => condition(authUser) ? <Component {...props} /> : null
			}
			</AuthUserContext.Consumer>
		)
	}

	return compose(
		withRouter,
		withFirebase,
	)(withAuthorization)
}

export default withAuthorization