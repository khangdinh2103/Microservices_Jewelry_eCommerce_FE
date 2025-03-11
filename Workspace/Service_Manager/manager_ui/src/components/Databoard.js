import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts"
import "../assets/css/Databoard.css"

const Dashboard = ({ products, onClose }) => {
    // Prepare data for charts
    const stockData = products.map(product => ({
      name: product.name,
      stock: product.stock
    }));
  
    const priceData = products.map(product => ({
      name: product.name,
      price: product.price
    }));
  
    const brandData = products.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {});
  
    const brandChartData = Object.entries(brandData).map(([brand, count]) => ({
      name: brand,
      value: count
    }));
  
    const materialData = products.reduce((acc, product) => {
      acc[product.material] = (acc[product.material] || 0) + 1;
      return acc;
    }, {});
  
    const materialChartData = Object.entries(materialData).map(([material, count]) => ({
      name: material,
      value: count
    }));
  
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
    return (
      <div className="dashboard-modal">
        <div className="dashboard-content">
          <button className="close-button" onClick={onClose}>&times;</button>
          <h2>Thống Kê Sản Phẩm</h2>
          <div className="chart-container">
            <div className="chart">
              <h3>Số Lượng Tồn Kho</h3>
              <BarChart width={400} height={250} data={stockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#8884d8" />
              </BarChart>
            </div>
            <div className="chart">
              <h3>Giá Sản Phẩm</h3>
              <BarChart width={400} height={250} data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="price" fill="#82ca9d" />
              </BarChart>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart">
              <h3>Sản Phẩm theo Thương Hiệu</h3>
              <PieChart width={300} height={300}>
                <Pie
                  data={brandChartData}
                  cx={150}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {brandChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
            <div className="chart">
              <h3>Sản Phẩm theo Chất Liệu</h3>
              <PieChart width={300} height={300}>
                <Pie
                  data={materialChartData}
                  cx={150}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {materialChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;


