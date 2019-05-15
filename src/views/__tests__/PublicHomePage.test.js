import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { render } from 'react-testing-library'
import PublicHomePage from '../PublicHomePage'

it("renders", () => {
    const { container } = render(
        <BrowserRouter>
            <PublicHomePage />
        </BrowserRouter>
    )
    expect(container).toHaveTextContent("Rethinking your life, one week at a time")
})

it("has a life calendar", () => {
    const { getByTestId } = render(
        <BrowserRouter>
            <PublicHomePage />
        </BrowserRouter>
    )
    expect(getByTestId("lifecalendar")).toHaveTextContent('Your Life Calendar')
})

it("has a signup button", () => {
    const { getByTestId } = render(
        <BrowserRouter>
            <PublicHomePage />
        </BrowserRouter>
    )
    expect(getByTestId("signupbutton")).toHaveTextContent('Sign Up Now')
})