import {useEffect, useState, MouseEvent} from "react";

export default function Orders ({ user }: { user: { id: string, email: string, role: string } }) {
  const [orders, setOrders] = useState([])

  const getOrders = async () => {
    const ordersServer = await fetch(`http://localhost:8001/order/courier-orders?courierId=${user.id}`, {
      method: 'GET',
    })

    const ordersJSON = await ordersServer.json()

    setOrders(ordersJSON)
    console.log(ordersJSON)
  }

  useEffect(() => {
    getOrders()
  }, [])

  const completeOrderHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget.id)

    await fetch(`http://localhost:8001/order/complete-order`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: event.currentTarget.id,
      })
    })

    getOrders()
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {orders.length ? (
        <div>
          {orders.map(order => (
            <div key={order.id}>
              <h2>{order.id}</h2>
              <p>{order.status}</p>
              {order.orderItems.length > 0 && (
                <div>
                  <h3>List of dishes</h3>
                  {order.orderItems.map(item => (
                    <div>
                      <img style={{width: '300px'}} src={item.image} alt={item.name}/>
                      <h4>{item.name}</h4>
                      <p>Price: {item.price}</p>
                      <p>Description: {item.description}</p>
                    </div>
                  ))}
                </div>
              )}
              <button id={order.id} onClick={completeOrderHandler}>Completed</button>
            </div>
          ))}
        </div>
      ) : (
        <h2>Your tasks are done. Take a rest</h2>
      )}
    </div>
  )
}
