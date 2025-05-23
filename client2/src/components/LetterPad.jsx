import React, { useState, useRef } from 'react';
import { Save, Printer, Download, Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import logo from '../assets/img/logo.png';
const LetterPad = () => {
    const [letterContent, setLetterContent] = useState('');
    const letterpadRef = useRef(null);
    const navigate = useNavigate();

    const handlePrint = () => {
        const printContents = letterpadRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        
        // Create a new window with only the letterpad content
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Navil Spinnings - Letterpad</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .letterhead { border-bottom: 2px solid #ccc; }
                        .top-border, .bottom-border { height: 20px; background: linear-gradient(to right, #4f46e5, #1e40af); }
                        .company-info { text-align: center; padding: 20px; }
                        .company-logo { display: inline-block; width: 60px; height: 60px; background: linear-gradient(to bottom right, #4f46e5, #1e40af); color: white; border-radius: 50%; text-align: center; line-height: 60px; font-size: 24px; font-weight: bold; margin-right: 15px; }
                        .company-name { display: inline-block; font-size: 28px; font-weight: bold; color: #3730a3; vertical-align: middle; }
                        .company-tagline { font-size: 18px; color: #666; margin-top: 10px; }
                        .company-details { color: #666; margin-top: 15px; }
                        .content { padding: 30px; min-height: 500px; }
                        .footer { padding: 0 30px 30px 30px; }
                        .signature-space { height: 60px; }
                        @media print {
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="letterpad-print">
                        ${printContents}
                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleSave = () => {
        // Save functionality would be implemented based on your backend
        alert('Letter saved successfully!');
    };

  const handleDownload = async () => {
    // Convert logo to base64
    const getImageAsBase64 = (imgElement) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            
            img.onerror = () => {
                // If image fails to load, resolve with empty string
                resolve('');
            };
            
            img.src = imgElement.src;
        });
    };

    // Get the HTML content of the letterpad
    let letterpadContent = letterpadRef.current.innerHTML;
    
    // Find and convert logo image to base64
    const logoImg = letterpadRef.current.querySelector('img[src*="logo"]');
    if (logoImg) {
        try {
            const base64Logo = await getImageAsBase64(logoImg);
            if (base64Logo) {
                letterpadContent = letterpadContent.replace(
                    logoImg.outerHTML,
                    `<img src="${base64Logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" />`
                );
            }
        } catch (error) {
            console.warn('Could not convert logo to base64:', error);
        }
    }
    
    // Replace the textarea with formatted content
    const formattedContent = letterContent.split('\n').map(line => 
        line.trim() === '' ? '<p><br/></p>' : `<p>${line}</p>`
    ).join('');
    
    // Remove textarea and show formatted content
    letterpadContent = letterpadContent.replace(
        /<textarea[\s\S]*?<\/textarea>/g, 
        formattedContent
    );
    
    // Remove the hidden print div since we're now using formatted content directly
    letterpadContent = letterpadContent.replace(
        /<div class="hidden print:block">[\s\S]*?<\/div>/g, 
        ''
    );
    
    // Process the letterpad content to ensure proper structure
    letterpadContent = letterpadContent.replace(
        /<div class="p-6 flex flex-col items-center text-center border-b-2 border-gray-300 company-info">/g,
        '<div class="company-info">'
    );
    
    letterpadContent = letterpadContent.replace(
        /<div class="flex items-center gap-3">/g,
        '<div class="company-header">'
    );
    
    letterpadContent = letterpadContent.replace(
        /<h1 class="text-3xl font-bold text-indigo-800 company-name">/g,
        '<h1 class="company-name">'
    );
    
    // Create complete HTML document with styles
    const completeHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Navil Spinnings - Letter</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 20px;
            background-color: #f9fafb;
        }
        .letterpad-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
        }
        .letterhead { 
            border-bottom: 2px solid #ccc; 
        }
        .top-border, .bottom-border { 
            height: 24px; 
            background: linear-gradient(to right, #4f46e5, #1e40af); 
        }
        .company-info { 
            text-align: center; 
            padding: 24px; 
            border-bottom: 2px solid #d1d5db;
        }
        .company-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 8px;
        }
        .company-logo { 
            width: 64px; 
            height: 64px;  
            color: white; 
            border-radius: 50%; 
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px; 
            font-weight: bold;
            overflow: hidden;
            flex-shrink: 0;
        }
        .company-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .company-name { 
            font-size: 32px; 
            font-weight: bold; 
            color: #312e81; 
            margin: 0;
            white-space: nowrap;
        }
        .company-tagline { 
            font-size: 18px; 
            color: #666; 
            margin-top: 8px;
            font-weight: 500;
        }
        .company-details { 
            color: #666; 
            margin-top: 12px; 
        }
        .company-details p {
            margin: 4px 0;
        }
        .content { 
            padding: 32px; 
            min-height: 500px; 
            line-height: 1.6;
        }
        .content p {
            margin: 16px 0;
        }
        .footer { 
            padding: 0 32px 32px 32px; 
        }
        .footer p {
            margin: 4px 0;
        }
        .signature-space { 
            height: 64px; 
        }
        .hidden { 
            display: none; 
        }
        .print-block {
            display: block;
        }
        /* Print styles */
        @media print {
            body {
                padding: 0;
                background-color: white;
            }
            .letterpad-container {
                box-shadow: none;
                border: none;
                max-width: none;
            }
        }
    </style>
</head>
<body>
    <div class="letterpad-container">
        ${letterpadContent}
    </div>
</body>
</html>`;
    
    // Create a Blob with the complete HTML content
    const file = new Blob([completeHtml], {type: 'text/html'});
    
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = `NavilSpinnings_Letter_${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Clean up the URL
    URL.revokeObjectURL(element.href);
};

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Toolbar - will be hidden during print */}
                    <div className="bg-gray-800 p-4 flex flex-wrap gap-3 rounded-t-lg no-print">
                        <button 
                            onClick={handleBack}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button 
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        
                    </div>

                    {/* Letterpad with Header */}
                    <div 
                        ref={letterpadRef} 
                        className="bg-white shadow-lg border border-gray-200"
                    >
                        {/* Header */}
                        <div className="letterhead">
                            {/* Top Border */}
                            <div className="h-6 bg-gradient-to-r from-indigo-600 to-blue-600 top-border"></div>
                            
                            {/* Logo and Company Details */}
                            <div className="p-6 flex flex-col items-center text-center border-b-2 border-gray-300 company-info">
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl company-logo">
                                        <img src={logo} alt="Logo" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-indigo-800 company-name">NAVIL SPINNINGS</h1>
                                </div>
                                <p className="text-lg font-medium text-gray-600 mt-2 company-tagline">Textile Manufacturing Excellence</p>
                                <div className="mt-3 text-gray-500 company-details">
                                    <p>53, Thekkalur, Periyakatuthottam, Arachalur, Erode - 638101</p>
                                    <p>Phone: +91 90477 94776 | Email: navilspinnings@gmail.com</p>
                                    <p>GST: 33BRVPS5283A1ZG</p>
                                </div>
                            </div>
                        </div>

                        {/* Editable Letter Content */}
                        <div className="p-8 content">
                            <textarea
                                value={letterContent}
                                onChange={(e) => setLetterContent(e.target.value)}
                                placeholder="Type your letter content here..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[500px] no-print"
                                rows={20}
                            />
                            {/* This div will show in print but not in the UI */}
                            <div className="hidden print:block">{letterContent.split('\n').map((line, i) => <p key={i}>{line || <br/>}</p>)}</div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 pb-8 footer">
                            <p className="text-gray-700">For Navil Spinnings</p>
                            <div className="h-16 signature-space"></div> {/* Space for signature */}
                            <p className="font-semibold">Authorized Signatory</p>
                        </div>

                        {/* Bottom Border */}
                        <div className="h-6 bg-gradient-to-r from-indigo-600 to-blue-600 bottom-border"></div>
                    </div>
                </div>
            </div>

            {/* Add print-specific styles */}
            <style dangerouslySetInnerHTML={{__html: `
                @media print {
                    .no-print { 
                        display: none !important; 
                    }
                    .print-only {
                        display: block !important;
                    }
                }
            `}} />
        </div>
    );
};

export default LetterPad;