import { userState} from 'react'

function Login(){
    const[email, setEmail]= userState('')
    const[password, setPassword]= userState('')

    return(
        <div>
            <h2>Login</h2>
        </div>
    )
}

export default Login