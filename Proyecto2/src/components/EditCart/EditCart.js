import React, { useState } from 'react';

const EditCart = ({ cart, onClose, onUpdateCart }) => {
  const [editedCart, setEditedCart] = useState(cart);

  const handleProductChange = (productIndex, field, value) => {
    const updatedProducts = [...editedCart.products];
    updatedProducts[productIndex][field] = value;
    setEditedCart(prevCart => ({
      ...prevCart,
      products: updatedProducts,
    }));
  };

  const handleSaveChanges = () => {
    onUpdateCart(editedCart);
    onClose();
  };

  const handleEditProducts = () => {
    localStorage.setItem('editingCartData', JSON.stringify(editedCart));
    window.location.href = './Politica';
  };
  

  return (
    <div className="edit-cart-modal">
      <h2>Edit Cart</h2>
      {editedCart && editedCart.products && editedCart.products.map((product, index) => (
        <div key={index} className="product-edit">
          <h3>Product {index + 1}</h3>
          <input
            type="text"
            value={product.title}
            onChange={(e) => handleProductChange(index, 'title', e.target.value)}
          />
          <input
            type="number"
            value={product.price}
            onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value))}
          />
          {/* More fields for other product properties */}
        </div>
      ))}
      <button onClick={handleSaveChanges}>Save Changes</button>
      <button onClick={onClose}>Cancel</button>

    <button onClick={() => handleEditProducts()}>Editar productos</button>

    </div>
  );
};

export default EditCart;
