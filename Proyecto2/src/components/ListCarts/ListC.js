import React from 'react';

const Cart = ({ cartsData }) => {
  return (
    <div>
      {cartsData.map((cart) => (
        <div className="cart-content" key={cart.id}>
          <div style={{textAlign: 'center', marginBottom: '16px'}}>
            <strong>Total de la compra:</strong>
            <div style={{fontSize: '2rem', color: '#00b4d8', fontWeight: 700, marginTop: 8}}>
              ${cart.total?.toFixed(2) ?? '0.00'}
            </div>
          </div>
          <div style={{marginTop: '12px'}}>
            <strong style={{color: '#0077b6'}}>Productos:</strong>
            <ul style={{listStyle: 'disc', paddingLeft: '20px', margin: '8px 0 0 0'}}>
              {cart.products && cart.products.map((product) => (
                <li key={product.id} style={{color: '#222', fontSize: '1rem', marginBottom: '4px'}}>
                  {product.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cart;
