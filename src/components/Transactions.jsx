import { useState } from "react"
import axios from "axios"
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react"
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Transactions(){
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState('idle') // idle, uploading, success, error
    const [message, setMessage] = useState('')

    const handleFileSelect = (e) =>{
        if(e.target.files && e.target.files[0]){
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async ()=>{
        if(!file) return

        setStatus('uploading')
        setMessage('')

        const formData= new FormData()
        formData.append('file',file)

        const token = localStorage.getItem('token')

        try{
            const response = await axios.post(`${API_URL}/transactions/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            setStatus('success')
            setMessage(response.data.message)
        } catch (error) {
            setStatus('error')
            setMessage('Upload failed. Try again.')
            console.log(error)
        }
        
    }

    return(
        <div className="min-h-screen bg-white p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Transactions</h1>

            <div className="bg-gray-100 rounded-xl p-6 max-w-md">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="text-sm text-gray-600"
                />
                {file && <p className="text-sm text-gray-500 mt-2">Selected: {file.name}</p>}
                {file && (
                    <button
                        onClick={handleUpload}
                        disabled={status === 'uploading'}
                        className="mt-4 w-full font-medium py-3 rounded-xl transition text-sm text-white disabled:opacity-50"
                        style={{ backgroundColor: '#0071E3' }}
                    >
                        {status === 'uploading' ? 'Uploading...' : 'Upload statement'}
                    </button>
                )}
                {message && (
                    <p className={`text-sm mt-2 ${status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    )
}

export default Transactions