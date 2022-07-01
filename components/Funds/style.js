import { css } from '@emotion/css'
const primaryColor="#E75B4E";
const secondaryColor="#FFDFD1";
export const balanceStyle = css`
  padding: 10px 25px;
  background-color: rgba(0, 0, 0, .08);
  
  display: inline-block;
  width: fit-content;
  text-align: center;
`

export const container = css`
  display: flex;
  flex-direction: column;
  width:30%;
`

const formStyle = css`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 0px 0px;
`
export const bottomFormStyle = css`
  ${formStyle};
  margin-bottom: 35px;
`

export const inputStyle = css`
  padding: 12px 20px;
  
  border: none;
  outline: none;
  background-color: rgba(0, 0, 0, .08);
  margin-bottom: 15px;
`

const textAreaStyle = css`
  ${inputStyle};
  width: 350px;
  height: 90px;
`
export const buttonStyle = css`
  background-color: ${primaryColor};
  color: white;
  padding: 12px 40px;
  border: none;
  font-weight: 700;
  width: 180;
  transition: all .35s;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, .75);
  }
`

export const labelStyle = css`
margin: 0px 0px 5px;
`
