import React from 'react';
import { FileText, Printer, BarChart2 } from 'lucide-react';
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        
        {/* Header Section */}
        <div className="relative w-full h-[45vh] flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-700 to-indigo-900 shadow-xl rounded-lg">
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />

          {/* Header Content */}
          <div className="relative z-10 px-6">
            <h1 className="text-5xl font-extrabold text-white tracking-wide drop-shadow-lg mb-2">
              Navil Spinnings
            </h1>
            <p className="text-lg text-white opacity-90 max-w-3xl mx-auto font-light">
              53, Thekkalur, Periyakatuthottam, Arachalur, Erode - 638101
            </p>
            <p className="text-white text-lg mt-2 italic">
              Delivering excellence in textile manufacturing.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          
          {/* Feature Cards with Neumorphism & Hover Effect */}
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-8 bg-white/70 backdrop-blur-lg border border-gray-400 shadow-lg rounded-xl transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-br from-blue-100 to-indigo-900 hover:text-white"
            >
              <feature.icon className="text-blue-700 w-16 h-16 mb-4 transition-transform duration-300 hover:scale-110" />
              <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-800 text-center text-sm group-hover:text-white">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: FileText,
    title: "Manage Invoices",
    description: "Create, update, and delete invoices easily to keep track of transactions."
  },
  {
    icon: Printer,
    title: "Generate PDF",
    description: "Generate and download professional invoice PDFs for your clients."
  },
  {
    icon: BarChart2,
    title: "View Reports",
    description: "Analyze financial data with detailed reports for better insights."
  }
];

export default Home;
