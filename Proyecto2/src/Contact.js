import './scss/Contact.scss'
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header/Header';
import Spiner from './components/Loanding/Spiner';
import Cart from './components/ListCarts/ListC';
import Navigation from './components/Navigation/Navigation';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus, faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';

const firebaseConfig = {
  apiKey: "AIzaSyAbijrL7TYfIvkk0_etnXF2kbvfQb6sfiE",
  authDomain: "proyecto-57db9.firebaseapp.com",
  projectId: "proyecto-57db9",
  storageBucket: "proyecto-57db9.appspot.com",
  messagingSenderId: "456845746374",
  appId: "1:456845746374:web:19fb99909003b752e437c7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

library.add(faTrash, faEdit, faPlus, faShoppingCart, faTimes);

function App() {
  const [cartdata, setCartData] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showCreateCartButton, setShowCreateCartButton] = useState(true);
  const [editingCartId, setEditingCartId] = useState(null);
  const [editingCart, setEditingCart] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  useEffect(() => {
    if (user) {
      const uid = user.uid;
      setUserId(uid);
      const displayName = user.displayName;

      const cartsCollection = collection(db, 'carts');
      const userCartsQuery = query(cartsCollection,
        where('userId', '==', uid),
        where('userName', '==', displayName)
      );

      getDocs(userCartsQuery).then((querySnapshot) => {
        const userCarts = [];
        querySnapshot.forEach((doc) => {
          userCarts.push({ id: doc.id, ...doc.data() });
        });
        setCartData(userCarts);
      });
    }
  }, [user]);

  useEffect(() => {
    const editingCartData = {};
    cartdata.forEach(cart => {
      const cartData = localStorage.getItem(`editingCartData_${cart.id}`);
      if (cartData) {
        editingCartData[cart.id] = JSON.parse(cartData);
      }
    });
    setEditingCart(editingCartData);
  }, [cartdata]);

  const handleDeleteCart = async (cartId) => {
    try {
      const cartRef = doc(db, 'carts', cartId);
      await deleteDoc(cartRef);
      setCartData((prevCartData) =>
        prevCartData.filter((cart) => cart.id !== cartId)
      );
      localStorage.removeItem(`editingCartData_${cartId}`);
    } catch (error) {
      console.error('Error al eliminar el carrito:', error);
    }
  };

  const handleCreateCart = () => {
    setShowCreateCartButton(true);
    window.location.href = "./Politica";
  };

  const handleUpdateCart = async (updatedCart) => {
    try {
      const cartRef = doc(db, 'carts', updatedCart.id);
      await updateDoc(cartRef, updatedCart);
      const updatedCarts = cartdata.map(cart => (cart.id === updatedCart.id ? updatedCart : cart));
      setCartData(updatedCarts);
    } catch (error) {
      console.error('Error al actualizar el carrito:', error);
    }
  };

  const handleEditCart = (cartId) => {
    setEditingCartId(cartId);
    const selectedCart = cartdata.find(cart => cart.id === cartId);
    setEditingCart(selectedCart);
    setIsModalOpen(true);
    localStorage.setItem('editingCartData', JSON.stringify(selectedCart));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCartId(null);
    setEditingCart(null);
  };

  return (
    <div className="App">
      <Header 
        title="Mis Carritos" 
        description="Gestiona tus carritos de compras"
        action={showCreateCartButton && (
          <button className="create-cart-btn icon-btn" onClick={handleCreateCart} title="Crear nuevo carrito">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </button>
        )}
      />
      
      <div className="carts-container">
        {cartdata ? (
          cartdata.map((cart) => (
            <div key={cart.id} className="cart">
              <div className="cart-header">
                <h2>Carrito</h2>
                <div className="cart-buttons">
                  {/* <button className="edit-btn" onClick={() => handleEditCart(cart.id)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button> */}
                  <button className="delete-btn" onClick={() => handleDeleteCart(cart.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
              <Cart cartsData={[cart]} userId={userId} onDeleteCart={handleDeleteCart} />
            </div>
          ))
        ) : (
          <Spiner />
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Editar Carrito</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              {/* El contenido del modal se agregará en la siguiente parte */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

