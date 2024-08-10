import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from "react-icons/md";
import { loadStripe } from '@stripe/stripe-js';
import { FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);

  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
    });

    const responseData = await response.json();

    if (responseData.success) {
      setData(responseData.data);
    }
  };

  const handleLoading = async () => {
    await fetchData();
  };

  useEffect(() => {
    setLoading(true);
    handleLoading();
    setLoading(false);
  }, []);

  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1
      })
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
    }
  };

  const decreaseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: 'include',
        headers: {
          "content-type": 'application/json'
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty - 1
        })
      });

      const responseData = await response.json();

      if (responseData.success) {
        fetchData();
      }
    }
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
      body: JSON.stringify({
        _id: id,
      })
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
    }
  };

  const handlePayment = async () => {
    const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    const response = await fetch(SummaryApi.payment.url, {
      method: SummaryApi.payment.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
      body: JSON.stringify({
        cartItems: data
      })
    });

    const responseData = await response.json();

    if (responseData?.id) {
      stripePromise.redirectToCheckout({ sessionId: responseData.id });
    }
  };

  const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
  const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0);

  return (
    <div className="cart-wrapper">
      <div className="cart-content">
        <button
          className="back-button"
          onClick={() => window.history.back()}
        >
          <FaArrowLeft />
          Volver
        </button>
        <h1 className="cart-title">Tu carrito</h1>
        {data.length === 0 && !loading && (
          <div className="empty-cart">
            <p>Sin datos</p>
          </div>
        )}

        <div className="cart-items">
          {loading ? (
            loadingCart.map((_, index) => (
              <div key={index} className="loading-item"></div>
            ))
          ) : (
            data.map((product) => (
              <div key={product._id} className="cart-item">
                <div className="item-image">
                  <img src={product?.productId?.productImage[0]} alt={product?.productId?.productName} />
                </div>
                <div className="item-details">
                  <div className="item-actions">
                    <MdDelete onClick={() => deleteCartProduct(product?._id)} className="delete-icon" />
                  </div>
                  <h2 className="item-name">{product?.productId?.productName}</h2>
                  <p className="item-category">{product?.productId.category}</p>
                  <div className="item-price">
                    <p className="item-price-current">{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                    <p className="item-price-total">{displayINRCurrency(product?.productId?.sellingPrice * product?.quantity)}</p>
                  </div>
                  <div className="item-quantity">
                    <button onClick={() => decreaseQty(product?._id, product?.quantity)} className="quantity-btn">-</button>
                    <span className="quantity-value">{product?.quantity}</span>
                    <button onClick={() => increaseQty(product?._id, product?.quantity)} className="quantity-btn">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {data.length > 0 && (
          <div className="cart-summary">
            {loading ? (
              <div className="summary-loading"></div>
            ) : (
              <div className="summary-content">
                <h2 className="summary-title">Resumen</h2>
                <div className="summary-item">
                  <p className="summary-label">Cantidad:</p>
                  <p className="summary-value">{totalQty}</p>
                </div>
                <div className="summary-item">
                  <p className="summary-label">Coste Total:</p>
                  <p className="summary-value">{displayINRCurrency(totalPrice)}</p>
                </div>
                <button onClick={handlePayment} className="payment-btn">Pagar</button>
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .cart-wrapper {
          position: fixed;
          top: 0;
          right: 0;
          width: 70%;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          z-index: 1000;
          overflow: hidden;
        }
        .cart-content {
          background: #fff;
          width: 100%;
          height: 100%;
          max-width: 520px;
          padding: 20px;
          overflow-y: auto;
          position: relative;
          box-shadow: -4px 0 8px rgba(0, 0, 0, 0.1);
        }
        .back-button {
          padding: 10px;
          display: flex;
          align-items: center;
          color: #007bff;
          cursor: pointer;
          margin-bottom: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        .back-button:hover {
          background: #c7efef; 
        }
        .back-button svg {
          margin-right: 8px;
        }
        .cart-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 20px;
          text-transform: uppercase;
          border-bottom: 2px solid #ddd;
          padding-bottom: 10px;
          color: #333;
        }
        .empty-cart {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          border-radius: 8px;
          color: #6c757d;
          font-size: 14px;
        }
        .cart-items {
          flex: 1;
        }
        .cart-item {
          display: grid;
          grid-template-columns: 128px 1fr;
          background: #fff;
          border-bottom: 1px solid #ddd;
          padding: 10px;
          margin-bottom: 10px;
        }
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-details {
          padding-left: 10px;
        }
        .item-actions {
          display: flex;
          justify-content: flex-end;
        }
        .delete-icon {
          color: #dc3545;
          cursor: pointer;
        }
        .item-name {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 10px 0;
        }
        .item-category {
          color: #6c757d;
          margin-bottom: 10px;
        }
        .item-price {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .item-price-current {
          color: #e74c3c;
          font-weight: bold;
        }
        .item-price-total {
          color: #333;
          font-weight: bold;
        }
        .item-quantity {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .quantity-btn {
          background: #e74c3c;
          color: #fff;
          border: none;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          cursor: pointer;
        }
        .quantity-value {
          font-size: 1rem;
        }
        .cart-summary {
          margin-top: 20px;
        }
        .summary-content {
          padding: 20px;
        }
        .summary-title {
          font-size: 1.25rem;
          font-weight: bold;
          color: #000;
          margin-bottom: 20px;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          text-transform: uppercase;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 1rem;
        }
        .summary-label, .summary-value {
          font-weight: bold;
        }
        .payment-btn {
          background: #e74c3c;
          color: #fff;
          padding: 10px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          width: 100%;
          font-weight: bold;
          text-transform: uppercase;
        }
        .payment-btn:hover {
          background: #c0392b;
        }
        .loading-item {
          background: #f0f0f0;
          border-radius: 8px;
          height: 100px;
          margin-bottom: 20px;
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0% { background-color: #f0f0f0; }
          50% { background-color: #e0e0e0; }
          100% { background-color: #f0f0f0; }
        }
      `}</style>
    </div>
  );
};

export default Cart;