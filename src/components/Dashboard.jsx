import { useState , useEffect } from 'react'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'


function Dashboard(){
    const [balance, setBalance] = useState(0)
    const [summary, setSummary] = useState({})
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    const totalSpend = Object.values(summary).reduce((sum, val) => sum + val, 0)

    const chartData = Object.entries(summary).map(([name,value]) => ({name,value}))
    const COLORS = ['#0071E3', '#006039', '#34C759', '#FF9500', '#FF3B30', '#AF52DE']

    const monthlyData = [
        { month: 'Mar', spend: 12000 },
        { month: 'Apr', spend: 15400 },
        { month: 'May', spend: 9800 },
        { month: 'Jun', spend: 17200 },
        { month: 'Jul', spend: 14300 },
        { month: 'Aug', spend: 8900 },
    ]

    const parseDate = (dateStr) => {
        const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 }
        const match = dateStr.match(/(\d{1,2})([A-Za-z]{3}),(\d{4})/)
        if (!match) return new Date(0)
        const [, day, monthAbbr, year] = match
        return new Date(year, months[monthAbbr], day)
    }

    const recentTransactions = [...transactions]
        .sort((a, b) => parseDate(b.date) - parseDate(a.date))
        .slice(0, 10)

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
        <div className="bg-gray-100 rounded-xl p-5 mb-8" style={{ height: 300 }}>
            <p className="text-sm text-gray-400 mb-4">6-month spend comparison <span className="text-xs">(placeholder data)</span></p>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="spend" fill="#0071E3" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="bg-gray-100 rounded-xl p-5">
            <p className="text-sm text-gray-400 mb-4">Recent transactions</p>
            {recentTransactions.length === 0 ? (
                <p className="text-sm text-gray-400">No transactions yet</p>
            ) : (
                <div className="space-y-2">
                    {recentTransactions.map((t) => (
                        <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{t.merchant}</p>
                                <p className="text-xs text-gray-400">{t.category} · {t.date}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">₹{t.amount.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
)
}

export default Dashboard