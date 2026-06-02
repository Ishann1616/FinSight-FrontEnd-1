import { useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login(){
    const[email, setEmail]= useState('')
    const[password, setPassword]= useState('')

    const navigate = useNavigate()
    const handleLogin = async() =>{
        try{
            const response= await axios.post('http://localhost:8000/auth/login',{
                email:email,
                password: password
            })
            localStorage.setItem('token', response.data.access_token)
            navigate('/dashboard')
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div>
            <h2>Login</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}
export default Login