import React from 'react'
import { toast } from "react-toastify"
import './Orders.css'
import { useState, useEffect } from 'react'
import axios from "axios"
import { assets } from '../../assets/assets'

const Order = ({ url }) => {

  const [orders, setOrders] = useState([]);

const statusHandler = async (event, orderId) => {
    const response  = await axios.post(url+"/api/order/status", {
      orderId,
      status: event.target.value
    })
    if(response.data.success){
      await fetchAllOrders();
    } 
}



  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error('Error');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error fetching orders');
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className='order-item'>
            <img src={assets.parcel_icon} alt="" />
            <div>
              <p className='order-item-food'>
                {order.items.map((item, idx) => (
                  idx === order.items.length - 1 ?
                    `${item.name} x ${item.quantity}` :
                    `${item.name} x ${item.quantity}, `
                ))}
              </p>
              <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + "," + order.address.state + "," + order.address.country + "," + order.address.zipcode}</p>
              </div>
              <p className='order-item-phone'>{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <select onChange={(event) => statusHandler(event,order._id)} value={order.status}>
              <option value="Food Processing">Food Processing</option>
              <option value="Out For Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Order
