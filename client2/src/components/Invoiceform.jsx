import React, { useEffect, useState } from 'react';
import { addinvoice, editinvoice } from '../services/api';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from '../utils/config.js';

const Invoiceform = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleback = () => {
    navigate('/list');
  };

  const [items, setItems] = useState([
    {
      productid: '',
      productname: '',
      unitprice: 0,
      unit: 'KG',
      quantity: 1,
      totalprice: 0,
      gstpercent: 0,
      discount: 0,
      netamount: 0,
    },
  ]);

  const [invoiceDetails, setInvoiceDetails] = useState({
    customername: '',
    customerphone: '',
    customeremail: '',
    customeraddress: '',
    customercity: '',
    customerstate: '',
    customerpincode: '',
    customergst: '',
    date: new Date().toISOString().split('T')[0],
    subtotal: 0,
    totalgst: 0,
    totaldiscount: 0,
    grandtotal: 0,
  });

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          console.error('Products data is not in expected format:', response.data);
          setProducts([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Populate form if editing an invoice
  useEffect(() => {
    if (id && location.state) {
      const { 
        customername, 
        customerphone, 
        customeremail, 
        customeraddress, 
        customercity, 
        customerstate, 
        customerpincode, 
        customergst, 
        date, 
        items: stateItems, 
        ...totals 
      } = location.state;
      
      setInvoiceDetails({ 
        customername, 
        customerphone: customerphone || '', 
        customeremail: customeremail || '', 
        customeraddress: customeraddress || '', 
        customercity: customercity || '', 
        customerstate: customerstate || '', 
        customerpincode: customerpincode || '', 
        customergst: customergst || '', 
        date, 
        ...totals 
      });
      
      setItems(stateItems || items);
      setIsEdit(true);
    }
  }, [id, location.state]);

  const handleProductChange = (index, productId) => {
    const selectedProduct = products.find(p => p._id === productId);
    
    if (selectedProduct) {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        productid: selectedProduct._id,
        productname: selectedProduct.name,
        unitprice: selectedProduct.price,
        gstpercent: selectedProduct.gstpercent || 0,
        unit: 'KG',
      };

      // Recalculate prices
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitprice = parseFloat(newItems[index].unitprice) || 0;
      const discount = parseFloat(newItems[index].discount) || 0;
      const gstpercent = parseFloat(newItems[index].gstpercent) || 0;

      const totalprice = quantity * unitprice;
      const discountAmount = (totalprice * discount) / 100;
      const taxableAmount = totalprice - discountAmount;
      const gstAmount = (taxableAmount * gstpercent) / 100;

      newItems[index].totalprice = totalprice;
      newItems[index].netamount = taxableAmount + gstAmount;

      setItems(newItems);
      calculateTotals(newItems);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (['quantity', 'unitprice', 'discount', 'gstpercent'].includes(field)) {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitprice = parseFloat(newItems[index].unitprice) || 0;
      const discount = parseFloat(newItems[index].discount) || 0;
      const gstpercent = parseFloat(newItems[index].gstpercent) || 0;

      const totalprice = quantity * unitprice;
      const discountAmount = (totalprice * discount) / 100;
      const taxableAmount = totalprice - discountAmount;
      const gstAmount = (taxableAmount * gstpercent) / 100;

      newItems[index].totalprice = totalprice;
      newItems[index].netamount = taxableAmount + gstAmount;
    }

    setItems(newItems);
    calculateTotals(newItems);
  };

  const addRow = () => {
    setItems([
      ...items,
      {
        productid: '',
        productname: '',
        unitprice: 0,
        unit: 'KG',
        quantity: 1,
        totalprice: 0,
        gstpercent: 0,
        discount: 0,
        netamount: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotals(newItems);
  };

  const calculateTotals = (updatedItems = items) => {
    const subtotal = updatedItems.reduce((acc, item) => acc + (item.totalprice || 0), 0);
    const totalgst = updatedItems.reduce(
      (acc, item) => acc + ((item.totalprice - (item.totalprice * item.discount) / 100) * item.gstpercent) / 100,
      0
    );
    const totaldiscount = updatedItems.reduce((acc, item) => acc + (item.totalprice * item.discount) / 100, 0);
    const grandtotal = subtotal - totaldiscount + totalgst;

    setInvoiceDetails((prev) => ({
      ...prev,
      subtotal,
      totalgst,
      totaldiscount,
      grandtotal,
    }));
  };

  const handleSubmit = async () => {
    const data = {
      ...invoiceDetails,
      items,
    };

    try {
      if (isEdit) {
        await editinvoice(id, data);
        alert('Invoice updated successfully!');
      } else {
        await addinvoice(data);
        alert('Invoice saved successfully!');
      }
      navigate('/list');
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading invoice data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleback}
            className="bg-white text-blue-600 px-5 py-2 rounded-lg shadow-md hover:bg-blue-50 border border-blue-200 transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {isEdit ? 'Update Invoice' : 'Create New Invoice'}
          </h1>
        </div>

        {/* Main Form Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4 px-6">
            <h2 className="text-xl font-semibold text-white">
              {isEdit ? 'Edit Existing Invoice' : 'New Invoice Details'}
            </h2>
            <p className="text-blue-100 text-sm">
              Fill in all required fields marked with an asterisk (*)
            </p>
          </div>

          {/* Customer Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name*
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={invoiceDetails.customername}
                  onChange={(e) => setInvoiceDetails({ ...invoiceDetails, customername: e.target.value })}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={invoiceDetails.customerphone}
                  onChange={(e) => setInvoiceDetails({ ...invoiceDetails, customerphone: e.target.value })}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={invoiceDetails.customeremail}
                  onChange={(e) => setInvoiceDetails({ ...invoiceDetails, customeremail: e.target.value })}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  placeholder="GST Number (if applicable)"
                  value={invoiceDetails.customergst}
                  onChange={(e) => setInvoiceDetails({ ...invoiceDetails, customergst: e.target.value })}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address*
              </label>
              <input
                type="text"
                placeholder="Street Address"
                value={invoiceDetails.customeraddress}
                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, customeraddress: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City*
                </label>
                <input
                  type="text"
                  placeholder="City"
                  value={invoiceDetails.customercity}
                  onChange={(e) => setInvoiceDetails({ ...invoiceDetails, customercity: e.target.value })}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State*
                </label>
                <input
                  type="text"
                  placeholder="State"
                  value={invoiceDetails.customerstate}
                  onChange={(e) => setInvoiceDetails({ ...invoiceDetails, customerstate: e.target.value })}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode*
                </label>
                <input
                  type="text"
                  placeholder="Pincode"
                  value={invoiceDetails.customerpincode}
                  onChange={(e) => setInvoiceDetails({ ...invoiceDetails, customerpincode: e.target.value })}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                value={invoiceDetails.date}
                onChange={(e) => setInvoiceDetails({ ...invoiceDetails, date: e.target.value })}
                className="border border-gray-300 p-3 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {/* Items Table */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Product Details
            </h3>
            
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <th className="px-4 py-3 text-left text-sm font-medium">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Quantity (KG)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Price/KG</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Discount (%)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">GST (%)</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Net Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                      <td className="px-4 py-3 border-t border-gray-200">
                        <select
                          value={item.productid}
                          onChange={(e) => handleProductChange(index, e.target.value)}
                          className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          required
                        >
                          <option value="">Select Product</option>
                          {Array.isArray(products) && products.map(product => (
                            <option key={product._id} value={product._id}>
                              {product.name} (₹{product.price}/KG)
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 border-t border-gray-200">
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3 border-t border-gray-200">
                        <input
                          type="number"
                          step="0.01"
                          value={item.unitprice}
                          onChange={(e) => handleItemChange(index, 'unitprice', e.target.value)}
                          className={`border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent ${item.productid !== '' ? 'bg-gray-100' : ''}`}
                          readOnly={item.productid !== ''}
                        />
                      </td>
                      <td className="px-4 py-3 border-t border-gray-200">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.discount}
                          onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                          className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3 border-t border-gray-200">
                        <input
                          type="number"
                          min="0"
                          value={item.gstpercent}
                          onChange={(e) => handleItemChange(index, 'gstpercent', e.target.value)}
                          className={`border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent ${item.productid !== '' ? 'bg-gray-100' : ''}`}
                          readOnly={item.productid !== ''}
                        />
                      </td>
                      <td className="px-4 py-3 border-t border-gray-200 font-medium text-blue-800">
                        ₹{item.netamount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 border-t border-gray-200">
                        <button
                          onClick={() => removeRow(index)}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition duration-200 flex items-center"
                          disabled={items.length === 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={addRow}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </button>
          </div>

          {/* Summary */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Invoice Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-800">₹{invoiceDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">GST Amount:</span>
                  <span className="font-medium text-gray-800">₹{invoiceDetails.totalgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-gray-800">₹{invoiceDetails.totaldiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 mt-2">
                  <span className="text-lg font-bold text-gray-800">Grand Total:</span>
                  <span className="text-lg font-bold text-blue-700">₹{invoiceDetails.grandtotal.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <button
                  onClick={handleSubmit}
                  className="w-full md:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 text-lg font-medium transition-all"
                >
                  {isEdit ? (
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Update Invoice
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save Invoice
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoiceform;