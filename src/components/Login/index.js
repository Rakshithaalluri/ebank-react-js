import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    console.log(response)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  renderUserIdField = () => {
    const {userId} = this.state
    return (
      <>
        <label className="input-label" htmlFor="userId">
          User ID
        </label>
        <input
          type="text"
          id="userId"
          placeholder="Enter User ID"
          className="username-input-field"
          value={userId}
          onChange={this.onChangeUserId}
        />
      </>
    )
  }

  renderPinField = () => {
    const {pin} = this.state
    return (
      <>
        <label className="input-label" htmlFor="pin">
          PIN
        </label>
        <input
          type="password"
          id="pin"
          placeholder="Enter PIN"
          className="username-input-field"
          value={pin}
          onChange={this.onChangePin}
        />
      </>
    )
  }

  render() {
    const {showErrorMsg, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <div className="login-img-con">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="website-login"
          />
          <div className="login-con">
            <div className="login-details">
              <h1 className="welcome-text"> Welcome Back! </h1>
              <form className="form-container" onSubmit={this.submitForm}>
                <div className="input-container">
                  {this.renderUserIdField()}
                </div>
                <div className="input-container">{this.renderPinField()}</div>
                <button type="submit" className="login-button">
                  Login
                </button>
                {showErrorMsg && <p className="error-msg"> *{errorMsg} </p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
