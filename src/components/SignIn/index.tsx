import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

export default function SignIn () {
  const [formData, setFormData] = useState(
    { email: '', password: '' }
  )
  const navigate = useNavigate()

  const submitHandler = async () => {
    const user = await fetch('http://localhost:8001/user/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    const userJSON = await user.json()
    console.log(userJSON)

    sessionStorage.setItem('user', JSON.stringify(userJSON))
    if (userJSON.role) {
      navigate('/')
    }
  }

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} id={'sign-in'}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          alignItems: 'start' }}
      >
        <label htmlFor={'email'}>Email</label>
        <input
          onChange={(event) => {
            setFormData({ ...formData, email: event.currentTarget.value })
          }}
          value={formData.email}
          id={'email'}
        />
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        alignItems: 'start' }}
      >
        <label htmlFor={'password'}>Password</label>
        <input
          onChange={(event) => {
            setFormData({ ...formData, password: event.currentTarget.value })
          }}
          value={formData.password}
          id={'password'}
        />
      </div>
      <button onClick={submitHandler} type={'button'}>Sign In</button>

      <Link to={'/sign-up'}>Sign up</Link>
    </form>
  )
}
