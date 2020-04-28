


import { FaFacebook, FaGoogle } from 'react-icons/fa'
import React from 'react'
import { Link } from 'gatsby'
import { navigate } from '@reach/router'
import { AppUser } from '../Auth'
import { AuthForm, Email, Password } from '../Forms'
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from '../../aws-exports';
Amplify.configure(awsconfig);

class SignIn extends React.Component {
  state = {
    username: ``,
    email: ``,
    password: ``,
    error: ``,
    loading: false,
    user: null, customState: null
  }

  handleUpdate = event => {
    if (event.target.name === 'email') {
      this.setState({
        [event.target.name]: event.target.value,
        username: event.target.value,
        error: '',
      })
    }
    this.setState({
      [event.target.name]: event.target.value,
      error: '',
    })
  }
  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          this.setState({ user: data });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  }

  login = async e => {
    const { setUser } = AppUser
    e.preventDefault()
    const { username, password } = this.state
    try {
      this.setState({ loading: true })
      await Auth.signIn(username, password)
      const user = await Auth.currentAuthenticatedUser()
      const userInfo = {
        ...user.attributes,
        username: user.username,
      }
      setUser(userInfo)
      this.setState({ loading: false })
      navigate('/home')
    } catch (err) {
      this.setState({ error: err, loading: false })
      console.log('error...: ', err)
    }

  }

  render() {


    return (
      <header>
        <div className="back">
          <AuthForm title="Sign in to your account" error={this.state.error}>
            <Email
              handleUpdate={this.handleUpdate}
              email={this.state.email}
              autoComplete="on"
            />
            <Password
              handleUpdate={this.handleUpdate}
              password={this.state.password}
              autoComplete="on"
            />
            <p className="text-center">
              Forgot your password? <Link to="/reset">Reset password</Link>
            </p>
            <div>
              <button
                onClick={e => this.login(e)}
                type="submit"
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading ? null : 'Sign In'}
                {this.state.loading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
            <p style={{ marginTop: 30 }} className="text-center">
              OR
            </p>
            <div >
              <button
                style={{ ...styles.button, ...styles.facebook }}
                onClick={() => Auth.federatedSignIn({ provider: 'Facebook' })}
              >
                <FaFacebook color='white' />
                <p style={styles.text}>Sign in with Facebook</p>
              </button>
              <button
                style={{ ...styles.button, ...styles.google }}
                onClick={() => Auth.federatedSignIn({ provider: 'Google' })}
              >
                <FaGoogle color='red' />
                <p style={{ ...styles.text, ...styles.grayText }}>Sign in with Google</p>
              </button>
            </div>
            <p style={{ marginTop: 40 }} className="text-center">
              No account? <Link to="/signup">Create account</Link>
            </p>
          </AuthForm>
        </div>
      </header>
    )
  }
}
const styles = {
  container: {
    height: '80vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  button: {
    width: '100%',
    maxWidth: 330,
    marginBottom: 10,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '0px 16px',
    borderRadius: 2,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, .3)',
    cursor: 'pointer',
    outline: 'none',
    border: 'none',
    minHeight: 10
  },
  facebook: {
    backgroundColor: "#3b5998"
  },
  google: {
    backgroundColor: "#FFFFFF"
  },
  email: {
    backgroundColor: '#db4437'
  },
  checkAuth: {
    backgroundColor: '#02bd7e'
  },
  hostedUI: {
    backgroundColor: 'rgba(0, 0, 0, .6)'
  },
  signOut: {
    backgroundColor: 'black'
  },
  withAuthenticator: {
    backgroundColor: '#FF9900'
  },
  icon: {
    height: 16,
    marginLeft: -1
  },
  text: {
    color: 'white',
    fontSize: 14,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  blackText: {
    color: 'black'
  },
  grayText: {
    color: 'rgba(0, 0, 0, .75)'
  },
  orangeText: {
    color: '#FF9900'
  }
}

export default SignIn
