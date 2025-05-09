const Product = ({data}) => {
    return (
        <div className="list">
            <ul>
               {data.map((product)=>(
                    <li key={JSON.stringify(product)}>
                        <div>
                            <p>ID: {product.id}</p>
                            <p>Title: {product.title}</p>
                            <p>Description: {product.description}</p>
                            <p>Price: {product.price}</p>
                            <p>Discount Percentage: {product.discountPercentage}</p>
                            <p>Rating: {product.rating}</p>
                            <p>Stock: {product.stock}</p>
                            <p>Brand: {product.brand}</p>
                            <p>Category: {product.category}</p>
                            <p>Thumbnail: {product.thumbnail}</p>
                            <p>Images: {[product.images]}</p>
                        </div>
                    </li>
               ))}
            </ul>
        </div>
    )
}

export default Product;