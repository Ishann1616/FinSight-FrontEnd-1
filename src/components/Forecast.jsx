import { useState, useEffect } from 'react'
import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Forecast() {
    const [predicted, setPredicted] = useState(0)
    const [accuracy, setAccuracy] = useState(null)
    const [actual, setActual] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchForecast = async () => {
            const token = localStorage.getItem('token')
            const headers = { Authorization: `Bearer ${token}` }
            try {
                const [predRes, accRes] = await Promise.all([
                    axios.get(`${API_URL}/predict/next-months`, { headers }),
                    axios.get(`${API_URL}/predict/accuracy`, { headers })
                ])
                setPredicted(predRes.data.predicted_total)
                setAccuracy(accRes.data.accuracy_percent)
                setActual(accRes.data.actual)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchForecast()
    }, [])

    return (
        <div className="min-h-screen bg-white p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Forecast</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-xl p-5">
                    <p className="text-sm text-gray-400 mb-1">Predicted next month spend</p>
                    <p className="text-2xl font-semibold text-gray-900">₹{predicted.toLocaleString()}</p>
                </div>
                <div className="bg-gray-100 rounded-xl p-5">
                    <p className="text-sm text-gray-400 mb-1">Last month's forecast accuracy</p>
                    <p className="text-2xl font-semibold text-gray-900">
                        {accuracy === null ? 'Not enough data yet' : `${accuracy}%`}
                    </p>
                    {actual > 0 && <p className="text-xs text-gray-400 mt-1">Actual spend: ₹{actual.toLocaleString()}</p>}
                </div>
            </div>
        </div>
    )
}

export default Forecast