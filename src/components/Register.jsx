import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [bankName, setBankName] = useState('')
    const [currentBalance, setCurrentBalance] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const passwordsMatch = password.length > 0 && password === confirmPassword

    const handleNext = () => {
        setStep(2)
    }

    const handleBack = () => {
        setStep(1)
    }

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:8000/auth/register', {
                name: name,
                email: email,
                password: password,
                bank_name: bankName,
                current_balance: parseFloat(currentBalance)
            })

            const loginResponse = await axios.post('http://localhost:8000/auth/login', {
                email: email,
                password: password
            })

            localStorage.setItem('token', loginResponse.data.access_token)
            navigate('/dashboard')
        } catch (err) {
            setError('Registration failed. Try again.')
            console.log(err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-sm px-8">

                <div className="text-center mb-10">
                    <h1 className="font-bold tracking-tight mb-2" style={{ color: '#006039', fontFamily: 'Cormorant Garamond, serif', fontSize: '42px' }}>FinSight</h1>
                    <p className="text-sm text-gray-400">
                        {step === 1 ? 'Create your account' : 'Tell us about your bank'}
                    </p>
                </div>

                {step === 1 && (
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm outline-none border border-gray-200 focus:border-blue-400 transition text-gray-900 placeholder-gray-400"
                        />
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
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm outline-none border border-gray-200 focus:border-blue-400 transition text-gray-900 placeholder-gray-400"
                        />
                        {confirmPassword.length > 0 && !passwordsMatch && (
                            <p className="text-xs text-red-500 px-1">Passwords don't match</p>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={!passwordsMatch || name === '' || email === ''}
                            className="w-full font-medium py-3 rounded-xl transition text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#0071E3' }}
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            placeholder="Bank name"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm outline-none border border-gray-200 focus:border-blue-400 transition text-gray-900 placeholder-gray-400"
                        />
                        <input
                            type="number"
                            value={currentBalance}
                            onChange={(e) => setCurrentBalance(e.target.value)}
                            placeholder="Current balance"
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm outline-none border border-gray-200 focus:border-blue-400 transition text-gray-900 placeholder-gray-400"
                        />
                        {error && <p className="text-xs text-red-500 px-1">{error}</p>}
                        <div className="flex gap-3">
                            <button
                                onClick={handleBack}
                                className="w-1/3 font-medium py-3 rounded-xl transition text-sm text-gray-600 border border-gray-200"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="w-2/3 font-medium py-3 rounded-xl transition text-sm text-white"
                                style={{ backgroundColor: '#0071E3' }}
                            >
                                Create account
                            </button>
                        </div>
                    </div>
                )}

                <p className="text-center text-sm text-gray-400 mt-8">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/')} className="text-gray-900 cursor-pointer font-medium">Sign in</span>
                </p>
            </div>
        </div>
    )
}

export default Register