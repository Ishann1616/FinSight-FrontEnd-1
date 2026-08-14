import { useState , useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'


function Dashboard(){
    const [balance, setBalance] = useState(0)
    const [summary, setSummary] = useState({})
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    const totalSpend = Object.values(summary).reduce((sum, val) => sum + val, 0)

    const chartData = Object.entries(summary).map(([name,value]) => ({name,value}))
    const COLORS = ['#0071E3', '#006039', '#34C759', '#FF9500', '#FF3B30', '#AF52DE']

    useEffect(() => {
    const fetchDashboardData = async () => {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        try {
            const [meRes, summaryRes, transRes] = await Promise.all([
                axios.get('http://localhost:8000/auth/me', { headers }),
                axios.get('http://localhost:8000/transactions/summary', { headers }),
                axios.get('http://localhost:8000/transactions/', { headers })
            ])

            setBalance(meRes.data.current_balance || 0)
            setSummary(summaryRes.data)
            setTransactions(transRes.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    fetchDashboardData()
    }, [])
    return (
    <div className="min-h-screen bg-white p-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-100 rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-1">Current balance</p>
                <p className="text-2xl font-semibold text-gray-900">₹{balance.toLocaleString()}</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-1">This month's spend</p>
                <p className="text-2xl font-semibold text-gray-900">₹{totalSpend.toLocaleString()}</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-5">
                <p className="text-sm text-gray-400 mb-1">Forecasted next month</p>
                <p className="text-2xl font-semibold text-gray-900">Coming soon</p>
            </div>
        </div>
        <div className="bg-gray-100 rounded-xl p-5 mb-8" style={{ height: 300 }}>
            <p className="text-sm text-gray-400 mb-4">Spending by category</p>
            {chartData.length === 0 ? (
                <p className="text-sm text-gray-400">No transactions this month yet</p>
            ) : (
                <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    </div>
)
}

export default Dashboard