import React from 'react'
import { Button } from 'antd'
import { Link } from 'react-router-dom'


export default function Success() {
return (
<div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
<h1 className="text-2xl font-bold mb-2">🎉 Order Successful!</h1>
<p className="mb-4">Thank you for your purchase. We’ll process your order shortly.</p>
<Link to="/">
<Button type="primary">Back to Home</Button>
</Link>
</div>
)
}