import React, { useState, useEffect } from 'react';
import { faShoppingCart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

import './scss/Politica.scss';

import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

library.add(faShoppingCart, faTrash);

function ProductModal({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{product.title}</h2>
        <img src={product.images && product.images[0]} alt={product.title} />
        <p><strong>Precio:</strong> ${product.price}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Categoría:</strong> {product.category}</p>
        <p><strong>Descripción:</strong> {product.description}</p>
      </div>
    </div>
  );
}

function CartSummaryModal({ userCart, userName, cartTotal, onClose, onFinalize, onRemove }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Resumen del carrito</h3>
        <p>Usuario: {userName}</p>
        {userCart.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          userCart.map((product) => (
            <div key={product.id} className="cart-item-modal">
              <span className="product-name">{product.title}</span>
              <span className="product-price">${product.price}</span>
              <button className="remove-cart-item" onClick={() => onRemove(product.id)} title="Quitar del carrito">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))
        )}
        <p style={{marginTop: '12px'}}><strong>Total:</strong> ${cartTotal}</p>
        <button onClick={onFinalize} disabled={userCart.length === 0}>Finalizar compra</button>
      </div>
    </div>
  );
}

function App() {
  const [productList, setProductList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userCart, setUserCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore();
      const productsCollection = collection(db, 'products');

      try {
        const querySnapshot = await getDocs(productsCollection);
        const productsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProductList(productsData);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProducts();
  
    const auth = getAuth();
  
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName);
      }
    });

  }, []);

  const handleAddProductToCart = async (productId) => {
    const selectedProduct = productList.find((product) => product.id === productId);
  
    if (!selectedProduct) {
      setError('Producto no encontrado en la lista.');
      return;
    }
  
    const existingProduct = userCart.find((product) => product.id === productId);
    if (existingProduct) {
      setError('El producto ya está en el carrito');
      return;
    }

    const updatedCart = [...userCart, { id: productId, ...selectedProduct }];
    setUserCart(updatedCart);
    setCartTotal(cartTotal + selectedProduct.price);
    setError('');
  
    const cartItemsFromStorage = JSON.parse(localStorage.getItem('userCart')) || [];
    cartItemsFromStorage.push({ id: productId, ...selectedProduct });
    localStorage.setItem('userCart', JSON.stringify(cartItemsFromStorage));
    console.log(cartItemsFromStorage);
  };

  const handleFinalizePurchase = async () => {
    if (!userId) {
      setError('Debes estar autenticado para finalizar la compra.');
      return;
    }

    const cartItemsFromStorage = JSON.parse(localStorage.getItem('userCart')) || [];

    if (cartItemsFromStorage.length === 0) {
      setError('No hay productos en el carrito.');
      return;
    }

    const db = getFirestore();
    const cartItem = {
      userId: userId,
      userName: userName,
      products: userCart,
      total: cartTotal,
    };

    try {
      await addDoc(collection(db, 'carts'), cartItem);
      console.log('Carrito finalizado y agregado a Firestore.');
      setUserCart([]);
      setCartTotal(0);
      setError('');

      localStorage.removeItem('userCart');
      console.log('Productos del localStorage agregados a Firestore.');
    } catch (error) {
      console.error('Error al agregar el carrito a Firestore:', error);
    }
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCart = userCart.filter(product => product.id !== productId);
    setUserCart(updatedCart);
    const newTotal = updatedCart.reduce((acc, p) => acc + p.price, 0);
    setCartTotal(newTotal);
    localStorage.setItem('userCart', JSON.stringify(updatedCart));
  };
  
  const totalPages = Math.ceil(productList.length / pageSize);
  const paginatedProducts = productList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="App">
      <Header title="Products" onBack={() => navigate('/contact')} />
      <button className="cart-fab" onClick={() => setShowCartModal(true)} title="Ver carrito">
        <FontAwesomeIcon icon={faShoppingCart} size="lg" />
        {userCart.length > 0 && <span className="cart-fab-count">{userCart.length}</span>}
      </button>
      <div className="product-list">
        {paginatedProducts &&
          paginatedProducts.map((product) => (
            <div key={product.id} className="product" onClick={() => setSelectedProduct(product)} style={{cursor: 'pointer'}}>
              {product.images && product.images.length > 0 && (
                <img src={product.images[0]} alt={product.title} className="product-thumb" />
              )}
              <h3>{product.title}</h3>
              <p><strong>Precio:</strong> ${product.price}</p>
              <button onClick={e => { e.stopPropagation(); handleAddProductToCart(product.id); }}>Agregar al carrito</button>
            </div>
          ))}
      </div>

      <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '24px 0' }}>
        <button className="main-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</button>
        <span style={{ alignSelf: 'center', minWidth: 80, textAlign: 'center', fontWeight: 600, letterSpacing: 1 }}>{currentPage} de {totalPages}</span>
        <button className="main-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente</button>
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      {showCartModal && (
        <CartSummaryModal
          userCart={userCart}
          userName={userName}
          cartTotal={cartTotal}
          onClose={() => setShowCartModal(false)}
          onFinalize={handleFinalizePurchase}
          onRemove={handleRemoveFromCart}
        />
      )}
    </div>
  );
}

export default App;