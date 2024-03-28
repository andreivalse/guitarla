import {  useState, useEffect  } from 'react'
import Header from "./components/Header"
import Guitar from "./components/Guitar"
import { db } from "./data/db"
function App() {
// comienza revisando el estado de localstorage si hay algun elemento para mandarlo al state  
    const initialCart = () => {
       const localStorageCart = localStorage.getItem('cart')
       return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    //state
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MIN_ITEMS = 1
    const MAX_ITEMS = 5

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart]) //Si cart cambia useEffect realiza el callback

    function addToCart(item){
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id)
        //validacion si existe
        if(itemExists >=0){
            if(cart[itemExists].quantity >= MAX_ITEMS ) return
           const updateCart = [...cart] //constate para no cambiar la mutabilidad del state
           updateCart[itemExists].quantity++ //se agrega la cantidad
           setCart(updateCart) //se actualiza el state con la funcion set
        }else {
            item.quantity = 1            
            setCart([...cart, item])   
        }
    }

    function removeFromCart(id) {
        //console.log("Eliminando ...", id)
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function decreaseQuantity(id) {
        //console.log("decrementando", id)
        const updateCart = cart.map( item => {
            if(item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity -1
                }
            }
            return item
        })
        setCart(updateCart)
    }

    function increaseQuantity(id) {
        //console.log("Incrementando", id)
        const updateCart = cart.map( item => {
            if(item.id === id  && item.quantity < MAX_ITEMS){
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updateCart)
    }

    function clearCart() {
        setCart([])
    }

  return (
    <>
    <Header 
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
    />
    

    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
           {data.map((guitar) =>(
               <Guitar 
                key = {guitar.id}
                guitar={guitar}
                setCar={setCart}
                addToCart={addToCart}
               />               
           ))} 
            
        </div>
    </main>


    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
    </footer>

    </>
  )
}

export default App
