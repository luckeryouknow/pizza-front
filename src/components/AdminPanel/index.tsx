import {MouseEvent, useEffect, useState} from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export default function AdminPanel () {
  const [orders, setOrders] = useState([])
  const [couriers, setCouriers] = useState([])
  const [displayMenu, setDisplayMenu] = useState(false)
  const [pickedOption, setPickedOption] =
    useState({ value: "", label: "" })
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  })

  let options = []

  if (couriers.length > 0) {
    options = couriers.map((item) => ({ value: item.id, label: item.email }))
  }

  const getOrders = async () => {
    const orders = await fetch('http://localhost:8001/order/admin-orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const couriers = await fetch('http://localhost:8001/user/free-couriers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const couriersJSON = await couriers.json()
    const ordersJSON = await orders.json()

    setCouriers(couriersJSON)
    setOrders(ordersJSON)
  }

  const assignHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    await fetch('http://localhost:8001/order/assign-order', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: event.currentTarget.id,
        courierId: pickedOption.value
      }),
    })

    getOrders()
  }

  const newMenuItemHandler = async () => {
    await fetch(`http://localhost:8001/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
    })
  }

  const callHandler = async (event: MouseEvent<HTMLButtonElement>) => {
    alert("Calling...")

    const id = event.currentTarget.id
    const orderId = id.replace('call-', '');

    await fetch('http://localhost:8001/order/call-order', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, })
    })

    getOrders()

    setTimeout( () => {
      fetch('http://localhost:8001/order/after-call', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId })
      }).then(() => getOrders())
    }, 3000)
  }

  useEffect(() => {
    getOrders()
  }, []);

  return (
    <div>
      <button onClick={() => setDisplayMenu(!displayMenu)}>{displayMenu ? "Go to orders" : "Go to menu"}</button>
      {displayMenu ? (
        <form style={{display: "flex", flexDirection: "column"}} id="menu-form">
          <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
            <label htmlFor="name">Name</label>
            <input
              onChange={event => setFormData({ ...formData, name: event.target.value })}
              value={formData.name}
              id={"name"}
              type="text"
              placeholder={"name"}
            />
          </div>

          <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
            <label htmlFor="description">Description</label>
            <input
              onChange={event => setFormData({ ...formData, description: event.target.value })}
              value={formData.description}
              id={"description"}
              type="text"
              placeholder={"description"}
            />
          </div>

          <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
            <label htmlFor="price">Price</label>
            <input
              onChange={event => setFormData({ ...formData, price: event.target.value })}
              value={formData.price}
              id={"price"}
              type="text"
              placeholder={"price"}
            />
          </div>

          <div style={{display: "flex", flexDirection: "column", alignItems: "start"}}>
            <label htmlFor="image">Image</label>
            <input
              onChange={event => setFormData({ ...formData, image: event.target.value })}
              value={formData.image}
              id={"image"}
              type="text"
              placeholder={"image"}
            />
          </div>
          <button onClick={newMenuItemHandler} type={"button"}>Create new menu item</button>
        </form>
      ) : (
        <div>
          {orders && orders.length > 0 && orders.map(order => (
            <div key={order.id}>
              <h2>{order.id}</h2>
              <p>{order.status}</p>
              <p>User name: {order.name}</p>
              <p>User number: {order.phoneNumber}</p>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {order.status === "READY_TO_DELIVER" && (
                  <Dropdown
                    onChange={(option) => setPickedOption(option)}
                    options={options}
                  />
                )}
                {order.status === "READY_TO_DELIVER" && (<button id={order.id} onClick={assignHandler}>assign</button>)}
                {order.status !== "READY_TO_DELIVER" && (
                  <button id={`call-${order.id}`} onClick={callHandler}>call</button>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
