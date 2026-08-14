import { NavLink, useNavigate  } from "react-router-dom";
import{
    LayoutDashboard,
    ArrowLeftRight,
    Wallet,
    TrendingUp,
    PiggyBank,
    MessageCircle,
    LogOut,
} from "lucide-react"

const navItems =[
    { label:"Dashboard", icon: LayoutDashboard, path: "/dashboard"},
    { label: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
    { label: "Budget", icon: Wallet, path: "/budget" },
    { label: "Forecast", icon: TrendingUp, path: "/forecast" },
    { label: "SIP & Loans", icon: PiggyBank, path: "/sip" },
    { label: "AI Chat", icon: MessageCircle, path: "/chat" },
];

export default function Sidebar(){
    const navigate = useNavigate()

    const handleLogout = () =>{
        localStorage.removeItem('token')
        navigate('/')
    }
    return(
        <div className="h-screen w-60 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col px-4 py-6 fixed">
                <div className="mb-10 px-2">
                    <h1 className="text-xl font-bold text-green-500">FinSight</h1>
                    <p className="text-xs text-gray-400">Your CA friend</p>
        </div>
                <nav className="flex-1 space-y-1">
            {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                    ? "bg-green-50 text-green-600 dark:bg-green-900/20"
                    : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400"
                }`
                }
            >
                    <Icon size={18} />
                {label}
            </NavLink>
            ))}
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-red-500 transition-all">
            <LogOut size={18} />
            Log out
        </button>
      </div>
    )
}