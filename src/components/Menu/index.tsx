import {useEffect, useState, MouseEvent} from "react";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export default function Menu () {
  const [menu, setMenu] = useState([])
  const [currentQuantity, setCurrentQuantity] = useState("0")
  const [displayOrder, setDisplayOrder] = useState(false)
  const options = [
    {
      value: '1',
      label: '1'
    },
    {
      value: '2',
      label: '2'
    },
    {
      value: '3',
      label: '3'
    },
    {
      value: '4',
      label: '4'
    },
    {
      value: '5',
      label: '5'
    }
  ]

  const getMenu = async () => {
    const menu = await fetch('http://localhost:8001/menu', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const menuJSON = await menu.json()

    setMenu(menuJSON)
  }

  const addHandler = (event: MouseEvent<HTMLButtonElement>) => {
    const items = localStorage.getItem("items")

    if (!items) {
      const menuItem = menu.filter(item => item.id === event.currentTarget.id)
      console.log(menuItem)

      if (currentQuantity !== "0") {
        const newItems = [{
          menuItemId: event.currentTarget.id,
          quantity: currentQuantity,
          ...menuItem[0],
        }]

        localStorage.setItem("items", JSON.stringify(newItems))
      }
    } else {
      const menuItem = menu.filter(item => item.id === event.currentTarget.id)
      console.log(menuItem)

      if (currentQuantity !== "0") {
        const newItems = JSON.parse(items)
        newItems.push({
          menuItemId: event.currentTarget.id,
          quantity: currentQuantity,
          ...menuItem[0],
        })

        localStorage.setItem("items", JSON.stringify(newItems))
      }
    }
  }

  const sendHandler = async () => {
    console.log(JSON.parse(localStorage.getItem("items")))

    await fetch('http://localhost:8001/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        defaultUserId: JSON.parse(sessionStorage.getItem('user')).id,
        items: JSON.parse(localStorage.getItem("items"))
      })
    })

    localStorage.removeItem("items")
    setDisplayOrder(false)
  }

  useEffect(() => {
    getMenu()
  }, [])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      <button
        onClick={() => setDisplayOrder(true)}
        style={{ position: 'fixed', zIndex: "5", top: "10px", right: "10px" }}>
        Check order
      </button>

      {displayOrder && (
        <div style={{
          position: "fixed",
          zIndex: "10",
          top: "0",
          left: "0",
          height: "100vh",
          width: "100%",
          background: "#213547",
          overflowY: "scroll"
        }}>
          <button
            onClick={() => setDisplayOrder(false)}
            style={{display: "block", marginLeft: "auto", marginTop: "10px", marginRight: "10px", marginBottom: "10px"}}
          >
            close
          </button>
          {localStorage.getItem("items") && (
            <div style={{width: "100%"}}>
              <div style={{display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center"}}>
                {JSON.parse(localStorage.getItem("items")).map(item => (
                  <div key={item.menuItemId}>
                    <img style={{width: '300px'}} src={item.image} alt={item.id}/>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p>{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>
              <button onClick={sendHandler}>Send order</button>
            </div>
          )}
        </div>
      )}

      {menu.map(item => (
        <div key={item.id}>
          <img style={{width: '300px'}} src={item.image} alt={item.id}/>
          <h2>{item.name}</h2>
          <p>{item.price}</p>
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Dropdown options={options} onChange={(option) => setCurrentQuantity(option.value)} />
            <button
              id={item.id}
              onClick={addHandler}
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
