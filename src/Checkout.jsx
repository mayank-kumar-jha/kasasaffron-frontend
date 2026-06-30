import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { getCurrentUserLocal } from './api/auth.service';
import api from './api/client';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

function StripePaymentForm({ clientSecret, total, onPaymentSuccess, onPaymentError }) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage('');

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed. Please check your card details.');
        setLoading(false);
        onPaymentError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setLoading(false);
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during payment.');
      setLoading(false);
      onPaymentError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-[#FFFDF7] border border-[#E6C587]/40 rounded-xl p-5 shadow-sm">
        <label className="block text-sm font-bold text-[#4A0E1A] mb-3 uppercase tracking-wider">
          Credit or Debit Card
        </label>
        <div className="py-4 px-4 bg-white rounded-lg border border-gray-200 shadow-inner">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '15px',
                  color: '#4A0E1A',
                  fontFamily: 'sans-serif',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center font-medium">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#8B2332] hover:bg-[#721c27] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
        )}
        {loading ? t('checkout.processing') : `${t("checkout.payBtn")} €${total.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { t } = useTranslation();
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUserLocal());

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    phone: '',
    pickupDate: '',
    notes: ''
  });

  useEffect(() => {
    const handleAuthChange = () => {
      const currentUser = getCurrentUserLocal();
      setUser(currentUser);
      if (currentUser && !formData.fullName) {
        setFormData(prev => ({ ...prev, fullName: currentUser.name }));
      }
    };
    window.addEventListener('userStateChange', handleAuthChange);
    return () => window.removeEventListener('userStateChange', handleAuthChange);
  }, [formData.fullName]);

  const [step, setStep] = useState('details'); // 'details' | 'payment' | 'success'
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentTxId, setPaymentTxId] = useState('');

  const vat = cartSubtotal * 0.10;
  const total = cartSubtotal + vat;

  // Removed the strict on-mount redirect so guests can view their cart items

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/auth');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.pickupDate) {
      setError('Please fill in all required fields marked with *');
      return;
    }

    setLoading(true);
    try {
      // Create order and checkout session on backend
      const checkoutItems = cartItems.map(item => ({
        productId: item.id.toString(), // Support mock numeric ID translation on backend fallback
        quantity: item.quantity,
        size: item.size
      }));

      const { data } = await api.post('/orders/checkout', {
        items: checkoutItems,
        notes: `Pickup: ${formData.pickupDate}. Notes: ${formData.notes}`
      });

      if (data?.data?.clientSecret) {
        setClientSecret(data.data.clientSecret);
        setOrderId(data.data.orderId);
        setStep('payment');
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Error communicating with checkout backend.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (txId) => {
    setPaymentTxId(txId);
    clearCart();
    setStep('success');
  };

  const handlePaymentError = (msg) => {
    setError(msg || 'Credit card authorization failed.');
  };

  // Removed strict user block so the cart can render for guests
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#FCFBF9] flex items-center justify-center pt-[100px] pb-20 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E6C587]/40 shadow-xl p-8 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#E6C587]/20 border border-[#E6C587] flex items-center justify-center text-[#B8893A] text-3xl mb-6 animate-bounce">
            ✓
          </div>
          <h2 className="text-3xl font-serif text-[#4A0E1A] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
            Thank You!
          </h2>
          <p className="text-[#4A0E1A]/80 mb-6 text-sm">Your payment was processed successfully. Your Spanish gourmet croquetas will be prepared for pickup.</p>
          
          <div className="w-full bg-[#FFFDF7] border border-[#E6C587]/30 rounded-xl p-5 mb-8 text-left space-y-3">
            <div>
              <p className="text-[10px] text-[#B8893A] font-bold uppercase tracking-widest">Order ID</p>
              <p className="text-xs font-mono text-[#4A0E1A] font-bold">{orderId}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#B8893A] font-bold uppercase tracking-widest">Pickup Date</p>
              <p className="text-sm text-[#4A0E1A] font-bold">
                {new Date(formData.pickupDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#B8893A] font-bold uppercase tracking-widest">Pickup Location</p>
              <p className="text-xs text-[#4A0E1A]/80 leading-relaxed font-bold">
                Kasa Saffron Croqueteria<br/>
                Gran Via Corts Catalanes 162, Local 27<br/>
                08038 Barcelona, Spain
              </p>
            </div>
          </div>

          <Link to="/flavours" className="w-full bg-[#4A0E1A] hover:bg-[#310911] text-white py-3.5 rounded-xl font-bold transition-all shadow-md">
            Order More Flavours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfaf5] via-[#f8eedf] to-[#f4e4cf] font-sans text-[#4A0E1A] pt-[100px] pb-20 relative overflow-hidden">
      {/* Background Floral Elements */}
      <img
        src="/Images/FLOWER.png"
        alt=""
        className="absolute top-[-5%] right-[-5%] w-[400px] pointer-events-none drop-shadow-sm opacity-10 rotate-45 z-0"
      />
      <img
        src="/Images/Hibiscus.png"
        alt=""
        className="absolute bottom-10 left-[10%] w-[500px] pointer-events-none drop-shadow-sm opacity-[0.04] z-0"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col items-center justify-center mb-10">
          <img src="/Images/Logo.png" alt="Kasa Saffron" className="w-16 h-16 object-contain mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif text-center text-saffron tracking-wide drop-shadow-sm" style={{ fontFamily: "'Cinzel', serif" }}>
            Secure Checkout
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center shadow-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            
            {step === 'details' ? (
              <form onSubmit={handleProceedToPayment} className="space-y-6">
                {/* Store Pickup */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-8 relative overflow-hidden group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-saffron/10 rounded-2xl text-saffron group-hover:scale-110 group-hover:bg-saffron group-hover:text-white transition-all duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif text-[#4A0E1A]">Store Pickup</h2>
                  </div>
                  <p className="text-[#4A0E1A]/80 mb-6 text-sm">Your order will be freshly prepared and ready for pickup.</p>
                  
                  <div className="bg-gradient-to-r from-[#FFFDF7] to-transparent border border-[#E6C587]/30 rounded-2xl p-5 relative overflow-hidden flex items-center justify-between group-hover:border-[#E6C587]/60 transition-colors duration-300">
                    <div className="flex items-start gap-4 z-10">
                      <div className="bg-[#FCF5E3] p-2.5 rounded-full shadow-inner">
                        <svg className="w-5 h-5 text-[#B8893A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#4A0E1A] text-sm md:text-base mb-1 font-cinzel">Kasa Saffron Croqueteria</h3>
                        <p className="text-[#4A0E1A]/70 text-xs md:text-sm">Gran Via Corts Catalanes 162, Local 27<br/>08038 Barcelona, Spain</p>
                      </div>
                    </div>
                    {/* Decorative Saffron Flower */}
                    <img src="/Images/Saffron_Flower.png" alt="" className="absolute right-0 bottom-0 w-32 h-auto object-contain opacity-20 translate-x-4 translate-y-4 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" />
                  </div>
                </div>

                {/* Your Details */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-8 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-saffron/10 rounded-2xl text-saffron">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-serif text-[#4A0E1A]">Your Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-medium text-[#4A0E1A] mb-2">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#4A0E1A]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Full name *
                        </span>
                      </label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg border border-[#E6C587]/40 focus:border-[#B8893A] focus:ring-1 focus:ring-[#B8893A] outline-none transition-colors text-sm" placeholder="e.g. John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A0E1A] mb-2">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#4A0E1A]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          Phone number *
                        </span>
                      </label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg border border-[#E6C587]/40 focus:border-[#B8893A] focus:ring-1 focus:ring-[#B8893A] outline-none transition-colors text-sm" placeholder="+34 XXX XXX XXX" />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-[#4A0E1A] mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#4A0E1A]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Pickup date *
                      </span>
                    </label>
                    <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleInputChange} required className="w-full px-4 py-3 rounded-lg border border-[#E6C587]/40 focus:border-[#B8893A] focus:ring-1 focus:ring-[#B8893A] outline-none transition-colors text-sm text-[#4A0E1A]" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4A0E1A] mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#4A0E1A]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Notes (preferred pickup time, etc.)
                      </span>
                    </label>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="2" className="w-full px-4 py-3 rounded-lg border border-[#E6C587]/40 focus:border-[#B8893A] focus:ring-1 focus:ring-[#B8893A] outline-none transition-colors text-sm resize-none" placeholder="E.g. Pickup at 6 PM"></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cartItems.length === 0 || loading}
                  className="w-full bg-gradient-to-r from-saffron to-saffron-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(189,86,26,0.3)] hover:shadow-[0_8px_25px_rgba(189,86,26,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none cursor-pointer group"
                >
                  {loading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  ) : (
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  )}
                  {loading ? t('checkout.processing') : (!user ? t('checkout.signInToProceed') : t('checkout.proceedBtn'))}
                </button>
              </form>
            ) : (
              // STRIPE PAYMENT STEP
              <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-8 space-y-6 animate-[fadeIn_0.5s_ease-out]">
                <div className="flex items-center gap-3 mb-4 border-b border-[#E6C587]/10 pb-4">
                  <button onClick={() => setStep('details')} className="text-saffron hover:text-saffron-dark flex items-center gap-1.5 text-sm font-bold transition-colors">
                    ← Edit details
                  </button>
                  <span className="text-gray-300">|</span>
                  <h2 className="text-xl md:text-2xl font-serif text-[#4A0E1A]">{t("checkout.paymentTitle")}</h2>
                </div>

                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    total={total}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </Elements>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] p-6 md:p-8 sticky top-24 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/5 rounded-full blur-3xl pointer-events-none group-hover:bg-saffron/10 transition-colors duration-500"></div>
              
              <div className="flex items-center gap-3 mb-6 border-b border-[#E6C587]/20 pb-4">
                <svg className="w-6 h-6 text-[#8B2332]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="text-xl md:text-2xl font-serif text-[#4A0E1A]">Order Summary</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-[#4A0E1A]/60 text-sm text-center py-4">{t("checkout.empty")}</p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={`${item.id}-${item.size}-${idx}`} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#4A0E1A] text-xs truncate">{item.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <p className="text-[#4A0E1A]/60 text-[10px]">{item.size}</p>
                          {step === 'details' && (
                            <div className="flex items-center border border-[#E6C587]/40 rounded-md overflow-hidden bg-white">
                              <button 
                                onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                className="px-1.5 py-0.5 text-[#4A0E1A] hover:bg-[#E6C587]/20 transition-colors text-[10px]"
                              >-</button>
                              <span className="px-1.5 text-[10px] font-bold text-[#4A0E1A] border-x border-[#E6C587]/20">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                className="px-1.5 py-0.5 text-[#4A0E1A] hover:bg-[#E6C587]/20 transition-colors text-[10px]"
                              >+</button>
                            </div>
                          )}
                          {step === 'payment' && (
                            <span className="text-[#4A0E1A]/80 text-[10px]">{t("checkout.qty")} {item.quantity}</span>
                          )}
                          {step === 'details' && (
                            <button 
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-[#8B2332] hover:text-red-600 transition-colors p-0.5"
                              title="Remove item"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#4A0E1A] text-xs">€{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Selected Date Echo */}
              {formData.pickupDate && (
                <div className="bg-[#FFFDF7] border border-[#E6C587]/30 rounded-xl p-4 flex items-center gap-3 mb-6">
                  <svg className="w-5 h-5 text-[#B8893A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <div>
                    <p className="text-[#B8893A] text-xs font-bold mb-0.5">Pickup date</p>
                    <p className="text-[#4A0E1A] text-xs font-bold">{new Date(formData.pickupDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="space-y-3 border-t border-[#E6C587]/20 pt-4 mb-6">
                <div className="flex justify-between text-sm text-[#4A0E1A]/70">
                  <span>{t("checkout.subtotal")}</span>
                  <span>€{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#4A0E1A]/70">
                  <span>{t("checkout.vat")}</span>
                  <span>€{vat.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-[#E6C587]/20 pt-4 mb-8">
                <span className="text-xl font-serif text-[#4A0E1A]">{t("checkout.total")}</span>
                <span className="text-3xl font-serif text-[#B8893A]">€{total.toFixed(2)}</span>
              </div>

              <Link to="/flavours" className="w-full flex items-center justify-center gap-2 text-[#4A0E1A]/70 hover:text-[#4A0E1A] transition-colors text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to flavors
              </Link>
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom Features Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-[#E6C587]/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[#4A0E1A]">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-[#B8893A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            <div>
              <p className="text-sm font-bold mb-0.5">100% Pure & Natural</p>
              <p className="text-xs text-[#4A0E1A]/60">The finest quality saffron</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-[#B8893A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
            <div>
              <p className="text-sm font-bold mb-0.5">Handpicked in Kashmir</p>
              <p className="text-xs text-[#4A0E1A]/60">Carefully selected threads</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-[#B8893A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <div>
              <p className="text-sm font-bold mb-0.5">Lab Tested for Purity</p>
              <p className="text-xs text-[#4A0E1A]/60">Ensuring unmatched quality</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-[#B8893A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            <div>
              <p className="text-sm font-bold mb-0.5">Premium Packaging</p>
              <p className="text-xs text-[#4A0E1A]/60">Sealed for freshness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
