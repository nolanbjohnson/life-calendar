import React from 'react'

import { withFirebase } from '../../providers/Firebase'

const SignOutButton = ({ firebase }) => (
  <button type="button" className="b ph2 pv1 mh3 br2 washed-blue input-reset ba b--washed-blue bg-transparent f6 dib pointer grow" onClick={() => firebase.doSignOut()}>
    Sign Out
  </button>
)

export default withFirebase(SignOutButton)