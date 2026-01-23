import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


function VerifyEmail() {
    const { token } = useParams()
    const [status, setStatus] = useState("Verifying...")
    const navigate = useNavigate()

    const verifyEmail = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/api/user/verify`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.data.success){
                setStatus("✅ Email verified Successfully.")
                setTimeout(() => {
                    navigate("/login")
                }, 2000)
            }
        } catch (error) {
            console.log(error)
            setStatus("❌ Verification failed. Please try again.")
        }
    }
    useEffect(() => {
        verifyEmail()
    }, [token])
  return (
    <div className='bg-gray-200 relative w-full h-[760px] overflow-hidden'>
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-4'>{status}</h2>
            </div>
        </div>
    </div>
  )
}

export default VerifyEmail