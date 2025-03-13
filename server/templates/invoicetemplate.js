module.exports = (invoice) => `
<!DOCTYPE html>
<html>
<head>
    <title>${invoice.customername}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
            line-height: 1.5;
            font-size: 14px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            font-family: 'Georgia', serif;
            font-size: 28px;
            margin: 0;
        }
        .header p {
            font-size: 12px;
            margin: 5px 0;
        }
        .invoice-details {
            margin-bottom: 20px;
        }
        .invoice-details p {
            margin: 5px 0;
        }
        .billed-to {
            margin-bottom: 20px;
        }
        .billed-to strong {
            display: block;
            margin-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table thead th {
            border-bottom: 2px solid #ccc;
            padding: 10px;
            text-align: left;
        }
        table tbody td {
            border-bottom: 1px solid #eee;
            padding: 10px;
        }
        .totals {
            text-align: right;
        }
        .totals p {
            margin: 5px 0;
        }
        .totals .grand-total {
            font-size: 16px;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #555;
        }
        .footer .signature {
            margin-top: 40px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Navil Spinnings</h1>
            <p>53, Thekkalur, Periyakatuthottam, Arachalur, Erode - 638101</p>
        </div>

        <div class="invoice-details">
            <p><strong>Invoice No:</strong> ${invoice._id}</p>
            <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
        </div>

        <div class="billed-to">
            <strong>Billed To:</strong>
            <p>${invoice.customername}</p>
            <p>${invoice.customeraddress || ''}</p>
            <p>${invoice.customerphone || ''}</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items.map(item => `
                <tr>
                    <td>${item.productname}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitprice.toFixed(2)}</td>
                    <td>${item.totalprice.toFixed(2)}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <p><strong>Subtotal:</strong> ${invoice.subtotal.toFixed(2)}</p>
            <p><strong>Tax:</strong> ${invoice.totalgst ? invoice.totalgst.toFixed(2) : '0.00'}</p>
            <p><strong>Discount:</strong> ${invoice.totaldiscount ? invoice.totaldiscount.toFixed(2) : '0.00'}</p>
            <p class="grand-total"><strong>Total:</strong> ${invoice.grandtotal.toFixed(2)}</p>
        </div>

        <div class="footer">
            <p>Thank you for your business!</p>
            <div class="signature">
                <p>Authorized Signature</p>
                <p>${invoice.sellername || ''}</p>
            </div>
        </div>
    </div>
</body>
</html>

`;
