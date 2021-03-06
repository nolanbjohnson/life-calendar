import styled from 'styled-components'

export const Form = styled.form.attrs({
  className: "pa2 black-80"
})``

export const Section = styled.section.attrs({
  className: "measure"
})``

export const Label = styled.label.attrs({
  className: "f6 b db mb2 tl"
})``

export const Input = styled.input.attrs(({ className }) => ({
  className: `input-reset ba b--black-20 pa2 mb2 db w-100 border-box ${className || ''}`
}))``

export const TextArea = styled.textarea.attrs({
  className: "db border-box hover-black measure ba b--black-20 pa2 br2 mb2 w-100 border-box"
})``

export const Submit = styled.input.attrs(props => ({
  className: `b ph3 pv2 input-reset ba b--black bg-transparent f6 dib ${props.disabled ? "" : "grow pointer"}`
}))``

