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
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-sm px-8">
                
                <div className="text-center mb-10">
                    <h1 className="font-bold tracking-tight mb-2" style={{color: '#006039', fontFamily: 'Cormorant Garamond, serif', fontSize: '42px'}}>FinSight</h1>
                    <p className="text-sm text-gray-400">Sign in to continue</p>
                </div>

                <div className="space-y-3">
                    <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm outline-none border border-gray-200 focus:border-blue-400 transition text-gray-900 placeholder-gray-400"
                        />
                    <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm outline-none border border-gray-200 focus:border-blue-400 transition text-gray-900 placeholder-gray-400"
                    />
                    <button
                                onClick={handleLogin}
                                className="w-full font-medium py-3 rounded-xl transition text-sm text-white"
                                style={{backgroundColor: '#0071E3'}}
                            >
                        Sign in
                    </button>
                </div>

                <p className="text-center text-sm text-gray-400 mt-8">
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/register')} className="text-gray-900 cursor-pointer font-medium">Register</span>   
                </p>
            </div>
        </div>
        );}
export default Login