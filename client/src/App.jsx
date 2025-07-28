import "./App.css";
import Navbar from "./Components/Nav/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import About from "./Components/Home/About";
import Shop from "./Components/Home/Shop";
import Contact from "./Components/Home/Contact";
import Productos from "./Components/Products/Products";
import AuthDrawer from "./Components/Nav/AuthDrawer";
import { useState, useEffect } from "react";
import CartDrawer from "./Components/Cart/CartDrawer";
import Footer from "./Components/Footer/Footer";
import ProductDetail from "./Components/Products/ProductDetail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import RutaPrivadaAdmin from "./Components/Admin/RutaPrivadaAdmin";
import EditarProducto from "./Components/Products/EditProducts";
import DeleteModal from "./Components/Products/DeleteModal";
import AgregarProducto from "./Components/Products/AddProduct";
import AddProductDrawer from "./Components/Products/AddProductDrawer";

function App() {
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [productos, setProductos] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openAddDrawer = () => setShowAddDrawer(true);
  const closeAddDrawer = () => setShowAddDrawer(false);
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  // ✅ Cargar productos desde el backend al iniciar
  useEffect(() => {
    axios.get("http://localhost:3001/api/products")
      .then((res) => setProductos(res.data))
      .catch((err) => console.error("Error al obtener productos:", err));
  }, []);

  const confirmDelete = (id) => {
    axios.delete(`http://localhost:3001/api/products/${id}`)
      .then(() => {
        toast.success("Producto eliminado");
        setProductos((prev) => prev.filter((p) => p.id !== id));
      })
      .catch(() => toast.error("Error al eliminar producto"))
      .finally(() => closeDeleteModal());
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (producto) => {
    const existingProduct = cartItems.find((item) => item.id === producto.id);
    if (existingProduct) {
      setCartItems(
        cartItems.map((item) =>
          item.id === producto.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...producto, qty: 1 }]);
    }
  };

  const incrementQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const decrementQty = (id) => {
    const product = cartItems.find((item) => item.id === id);
    if (product.qty === 1) {
      removeFromCart(id);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
      );
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  return (
    <>
      <Navbar
        cartItems={cartItems}
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        setCartOpen={setIsCartOpen}
        openAuthDrawer={() => setIsAuthOpen(true)}
        user={user}
        setUser={setUser}
        openAddDrawer={openAddDrawer}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        cartItems={cartItems}
        incrementQty={incrementQty}
        decrementQty={decrementQty}
        removeFromCart={removeFromCart}
      />

      <AuthDrawer
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        setUser={setUser}
      />

      <DeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={() => confirmDelete(selectedProduct.id)}
        product={selectedProduct}
      />

      <AddProductDrawer
        show={showAddDrawer}
        onClose={closeAddDrawer}
        onProductAdded={() => {
      
          axios.get("http://localhost:3001/api/products")
            .then((res) => setProductos(res.data));
        }}
      />

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} user={user} />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/productos"
          element={
            <Productos
              productos={productos}
              setProductos={setProductos}
              addToCart={addToCart}
              user={user}
              onDelete={openDeleteModal}
            />
          }
        />
        <Route
          path="/producto/:id"
          element={<ProductDetail addToCart={addToCart} user={user} />}
        />
        <Route
          path="/admin/editar/:id"
          element={
            <RutaPrivadaAdmin user={user}>
              <EditarProducto />
            </RutaPrivadaAdmin>
          }
        />
        <Route path="/agregar-producto" element={<AgregarProducto />} />
      </Routes>

      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
