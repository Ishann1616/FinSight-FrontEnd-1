import { useState, useEffect } from 'react'
import axios from 'axios'
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Budget(){
    const [alerts, setAlerts] = useState([])
    const [category, setCategory] = useState('')
    const [limit, setLimit] = useState('')
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    const fetchAlerts = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.get(`${API_URL}/budget/alerts`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAlerts(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

      useEffect(() => {
        fetchAlerts()
    }, [])

    const handleSetBudget = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        try {
            await axios.post(`${API_URL}/budget/`, {
                category: category,
                limit: parseFloat(limit)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessage(`Budget set for ${category}`)
            setCategory('')
            setLimit('')
            fetchAlerts()
        } catch (error) {
            setMessage('Failed to set budget')
            console.log(error)
        }
    }
    return (
        <div className="min-h-screen bg-white p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Budget</h1>
            <form onSubmit={handleSetBudget} className="bg-gray-100 rounded-xl p-5 mb-8 max-w-md">
                <p className="text-sm text-gray-400 mb-4">Set a budget</p>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category (e.g. Food)"
                    className="w-full px-4 py-3 rounded-xl bg-white text-sm outline-none border border-gray-200 focus:border-blue-400 transition text-gray-900 placeholder-gray-400 mb-3"
                />
                <input
                    type="number"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    placeholder="Monthly limit (₹)"
                    className="w-full px-4 py-3 rounded-xl bg-white text-sm outline-none border border-gray-200 focus:border-blue-400 transition text-gray-900 placeholder-gray-400 mb-3"
                />
                <button
                    type="submit"
                    className="w-full font-medium py-3 rounded-xl transition text-sm text-white"
                    style={{ backgroundColor: '#0071E3' }}
                >
                    Set budget
                </button>
                {message && <p className="text-sm text-gray-500 mt-2">{message}</p>}
            </form>

            <div className="bg-gray-100 rounded-xl p-5 max-w-md">
                <p className="text-sm text-gray-400 mb-4">Budget status</p>
                {alerts.length === 0 ? (
                    <p className="text-sm text-gray-400">No budgets set, or nothing to flag this month</p>
                ) : (
                    <div className="space-y-3">
                        {alerts.map((a, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{a.category}</p>
                                    <p className={`text-xs ${a.status === 'EXCEEDED' ? 'text-red-500' : 'text-orange-500'}`}>
                                        {a.status} — {a.percent}%
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Budget