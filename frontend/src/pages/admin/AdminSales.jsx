import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// Replace these imports with your actual UI component paths
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 

const AdminSales = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalSales: 0,
        sales: [] // This matches the 'formattedSales' from your backend
    });

    const fetchStats = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/sales`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (res.data.success) {
                setStats(res.data);
            }
        } catch (error) {
            console.log("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className=' bg-gray-100 py-10 mx-auto px-4'>
            <div className='p-6 grid gap-6 lg:grid-cols-4'>
                
                {/* Stats Cards */}
                <Card className="bg-pink-500 text-white shadow">
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        {stats.totalUsers}
                    </CardContent>
                </Card>

                <Card className="bg-pink-500 text-white shadow">
                    <CardHeader>
                        <CardTitle>Total Products</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        {stats.totalProducts}
                    </CardContent>
                </Card>

                <Card className="bg-pink-500 text-white shadow">
                    <CardHeader>
                        <CardTitle>Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        {stats.totalOrders}
                    </CardContent>
                </Card>

                <Card className="bg-pink-500 text-white shadow">
                    <CardHeader>
                        <CardTitle>Total Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        ₹{stats.totalSales?.toLocaleString("en-IN")}
                    </CardContent>
                </Card>

                {/* Sales Chart */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Sales (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.sales}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="#F472B6" 
                                    fill="#F472B6" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminSales;