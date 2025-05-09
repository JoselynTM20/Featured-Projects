import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation/Navigation';
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import Header from './components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


function EditForm({ product, onSave, onCancel }) {
  const [editedProduct, setEditedProduct] = useState(product);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    onSave(editedProduct);
  };

  return (
    <form onSubmit={handleSave}>
      <h2 className="edit-form-title">Editar producto</h2>
      {editedProduct.images && (
        <div className="edit-form-img-container">
          <img
            src={Array.isArray(editedProduct.images) ? editedProduct.images[0] : editedProduct.images}
            alt={editedProduct.title}
            className="product-thumb"
            style={{ margin: 0, display: 'block' }}
          />
        </div>
      )}
      <div className="edit-form-row">
        <div className="edit-form-col">
          <label htmlFor="edit-title">Title</label>
          <input id="edit-title" type="text" name="title" value={editedProduct.title} onChange={handleInputChange} />
        </div>
        <div className="edit-form-col">
          <label htmlFor="edit-brand">Brand</label>
          <input id="edit-brand" type="text" name="brand" value={editedProduct.brand} onChange={handleInputChange} />
        </div>
      </div>
      <div className="edit-form-row">
        <div className="edit-form-col">
          <label htmlFor="edit-price">Price</label>
          <input id="edit-price" type="number" name="price" value={editedProduct.price} onChange={handleInputChange} />
        </div>
        <div className="edit-form-col">
          <label htmlFor="edit-stock">Stock</label>
          <input id="edit-stock" type="number" name="stock" value={editedProduct.stock} onChange={handleInputChange} />
        </div>
      </div>
      <div className="edit-form-row">
        <div className="edit-form-col">
          <label htmlFor="edit-category">Category</label>
          <input id="edit-category" type="text" name="category" value={editedProduct.category} onChange={handleInputChange} />
        </div>
      </div>
      <label htmlFor="edit-description" style={{ marginTop: 8 }}>Description</label>
      <textarea id="edit-description" name="description" value={editedProduct.description} onChange={handleInputChange} />
      <div className="edit-btn-group">
        <button type="submit">Guardar cambios</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}


function AddForm({ onSave, onCancel }) {
  const initialProduct = {
    brand: '',
    category: '',
    description: '',
    discountPercentage: 0,
    images: '',
    price: 0,
    rating: 0,
    stock: 0,
    thumbnail: '',
    title: '',
  };

  const [newProduct, setNewProduct] = useState(initialProduct);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    onSave(newProduct);
    setNewProduct(initialProduct);
  };

  return (
    <form onSubmit={handleSave}>
      <h2 className="edit-form-title">Agregar producto</h2>
      <div className="edit-form-row">
        <div className="edit-form-col">
          <label htmlFor="add-title">Title</label>
          <input id="add-title" type="text" name="title" value={newProduct.title} onChange={handleInputChange} />
        </div>
        <div className="edit-form-col">
          <label htmlFor="add-brand">Brand</label>
          <input id="add-brand" type="text" name="brand" value={newProduct.brand} onChange={handleInputChange} />
        </div>
      </div>
      <div className="edit-form-row">
        <div className="edit-form-col">
          <label htmlFor="add-price">Price</label>
          <input id="add-price" type="number" name="price" value={newProduct.price} onChange={handleInputChange} />
        </div>
        <div className="edit-form-col">
          <label htmlFor="add-stock">Stock</label>
          <input id="add-stock" type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} />
        </div>
      </div>
      <div className="edit-form-row">
        <div className="edit-form-col">
          <label htmlFor="add-category">Category</label>
          <input id="add-category" type="text" name="category" value={newProduct.category} onChange={handleInputChange} />
        </div>
        <div className="edit-form-col">
          <label htmlFor="add-rating">Rating</label>
          <input id="add-rating" type="number" name="rating" value={newProduct.rating} onChange={handleInputChange} />
        </div>
      </div>
      <div className="edit-form-row">
        <div className="edit-form-col">
          <label htmlFor="add-images">Images URL</label>
          <input id="add-images" type="text" name="images" value={newProduct.images} onChange={handleInputChange} />
        </div>
        <div className="edit-form-col">
          <label htmlFor="add-thumbnail">Thumbnail</label>
          <input id="add-thumbnail" type="text" name="thumbnail" value={newProduct.thumbnail} onChange={handleInputChange} />
        </div>
      </div>
      <label htmlFor="add-description" style={{ marginTop: 8 }}>Description</label>
      <textarea id="add-description" name="description" value={newProduct.description} onChange={handleInputChange} />
      <div className="edit-btn-group">
        <button type="submit">Agregar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}


function App() {
  const [productList, setProductList] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState(null);
  const navigate = useNavigate();
  const [showCartModal, setShowCartModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(productList.length / pageSize);
  const paginatedProducts = productList.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  useEffect(() => {
    // Función para obtener los productos desde Firebase
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

    fetchProducts(); // Llama a la función para obtener los productos

  }, []); // No necesitas depender de ningún estado aquí

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
  };

  const handleAddProduct = () => {
    setAddingProduct(true);
  };


  const handleSaveChanges = async (editedProduct) => {
    const db = getFirestore();
    const productRef = doc(db, 'products', editedProduct.id);

    try {
      await setDoc(productRef, editedProduct, { merge: true });
      console.log('Cambios guardados en Firebase.');
    } catch (error) {
      console.error('Error al guardar cambios en Firebase:', error);
    }

    const updatedProducts = productList.map((product) =>
      product.id === editedProduct.id ? editedProduct : product
    );
    setProductList(updatedProducts);
    setEditingProductId(null);
  };

  const handleSaveNewProduct = async (newProduct) => {
    const db = getFirestore();

    try {
      const addedDocRef = await addDoc(collection(db, 'products'), newProduct);
      const addedProduct = { id: addedDocRef.id, ...newProduct };
      console.log('Producto agregado a Firebase.');
      
      const updatedProducts = [...productList, addedProduct];
      setProductList(updatedProducts);
      setAddingProduct(false);
    } catch (error) {
      console.error('Error al agregar el producto a Firebase:', error);
    }
  };



  const handleDeleteProduct = async (productId) => {
    const db = getFirestore();
    const productRef = doc(db, 'products', productId);

    try {
      await deleteDoc(productRef);
      console.log('Producto eliminado de Firebase.');

      const updatedProducts = productList.filter((product) => product.id !== productId);
      setProductList(updatedProducts);
    } catch (error) {
      console.error('Error al eliminar el producto de Firebase:', error);
    }
  };


  
  return (
    <div className="App">
      <Header
        title="Productos"
        action={
          <button className="main-btn" onClick={handleAddProduct} style={{ maxWidth: 220 }}>
            Agregar producto
          </button>
        }
      />
      <button className="cart-fab" onClick={() => setShowCartModal(true)} title="Ver carrito">
        <FontAwesomeIcon icon={faShoppingCart} size="lg" />
      </button>
      {addingProduct && (
        <div className="modal-overlay" onClick={() => setAddingProduct(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAddingProduct(false)}>×</button>
            <AddForm onSave={handleSaveNewProduct} onCancel={() => setAddingProduct(false)} />
          </div>
        </div>
      )}

      <div className="product-list">
        {paginatedProducts.map((product) => (
          <div key={product.id} className="product">
            <h3>{product.title}</h3>
            {product.images && product.images.length > 0 && (
              <img
                src={Array.isArray(product.images) ? product.images[0] : product.images}
                alt={product.title}
                className="product-thumb"
              />
            )}
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <div className="icon-btn-group">
              <button className="icon-btn" title="Editar" onClick={() => setSelectedProductToEdit(product)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="icon-btn" title="Eliminar" onClick={() => handleDeleteProduct(product.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '24px 0' }}>
        <button className="main-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</button>
        <span style={{ alignSelf: 'center', minWidth: 80, textAlign: 'center', fontWeight: 600, letterSpacing: 1 }}>{currentPage} de {totalPages}</span>
        <button className="main-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Siguiente</button>
      </div>

      {selectedProductToEdit && (
        <div className="modal-overlay" onClick={() => setSelectedProductToEdit(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProductToEdit(null)}>×</button>
            <EditForm
              product={selectedProductToEdit}
              onSave={async (editedProduct) => {
                await handleSaveChanges(editedProduct);
                setSelectedProductToEdit(null);
              }}
              onCancel={() => setSelectedProductToEdit(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
