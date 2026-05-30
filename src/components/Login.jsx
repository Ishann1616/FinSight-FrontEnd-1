import { useState} from 'react'

function Login(){
    const[email, setEmail]= useState('')
    const[password, setPassword]= useState('')

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
        </div>



    )
}

export default Login