import axios from 'axios'
import React, { useEffect, useState } from 'react'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const accessToken = localStorage.getItem("accessToken")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/v1/orders/all", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        if (data.success) setOrders(data.orders)
      } catch (error) {
        console.error("❌ Failed to fetch admin orders:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [accessToken])

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading all orders...</div>
  }

  return (
    <div className="py-10 mx-auto px-8 pl-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">All Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 border-b">Order ID</th>
                <th className="px-4 py-3 border-b">User</th>
                <th className="px-4 py-3 border-b">Products</th>
                <th className="px-4 py-3 border-b">Amount</th>
                <th className="px-4 py-3 border-b">Status</th>
                <th className="px-4 py-3 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = (order.status || '').toLowerCase()
                const statusStyles =
                  status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'

                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b text-xs text-gray-700 break-all">{order._id}</td>
                    <td className="px-4 py-3 border-b">
                      <div className="text-sm text-gray-900">
                        {order.user?.firstName || order.user?.name || 'Unknown'} {order.user?.lastName || ''}
                      </div>
                      <div className="text-xs text-gray-500">{order.user?.email || 'No email'}</div>
                    </td>
                    <td className="px-4 py-3 border-b">
                      {order.products?.map((item, idx) => {
                        const name = item.productId?.productName || item.productName || 'Product'
                        return (
                          <div key={`${order._id}-${idx}`} className="text-sm text-gray-700">
                            {name} x {item.quantity}
                          </div>
                        )
                      })}
                    </td>
                    <td className="px-4 py-3 border-b font-medium text-gray-900">
                      ₹{Number(order.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 border-b">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusStyles}`}>
                        {status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminOrders
