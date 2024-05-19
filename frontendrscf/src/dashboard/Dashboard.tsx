import React,{ useEffect, useState } from 'react';
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Space, Statistic, Table, Typography } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getProductListNoPagination } from "../api/productApi";
import { getOrderList } from "../api/orderApi";
import { getUserList } from "../api/adminApi";
import { AxiosError } from 'axios';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [orders, setOrders] = useState(0);
  const [products, setProducts] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {

    async function getOrdersTop(){
      await getOrderList()
        .then(res=>{
          if(res && !(res instanceof AxiosError)){
            setOrders(res.data.data?.length);     
          }
        })
        .catch(error => console.error('request getOrdersTop:', error));       
    }
  
    async function getProductsTop(){
      await getProductListNoPagination()
        .then(res=>{
          if(res && !(res instanceof AxiosError)){
            setProducts(res.data.data?.length);     
          }
        })
        .catch(error => console.error('request getProductsTop:', error)); 
    }

    async function getUsers(){
      await getUserList()
        .then(res=>{
          if(res && !(res instanceof AxiosError)){
            setCustomers(res.data.data?.length);     
          }
        })
        .catch(error => console.error('request getUsers:', error));
    }
 
    getOrdersTop();
    getProductsTop();
    getUsers();
     
  }, []);

  return (
    <Space size={20} direction="vertical">
      <Typography.Title level={4}>Dashboard</Typography.Title>
      <Space direction="horizontal">
        <DashboardCard
          icon={
            <ShoppingCartOutlined
              style={{
                color: "green",
                backgroundColor: "rgba(0,255,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            />
          }
          title={"Orders"}
          value={orders}
        />
        <DashboardCard
          icon={
            <ShoppingOutlined
              style={{
                color: "blue",
                backgroundColor: "rgba(0,0,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            />
          }
          title={"Product"}
          value={products}
        />
        <DashboardCard
          icon={
            <UserOutlined
              style={{
                color: "purple",
                backgroundColor: "rgba(0,255,255,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            />
          }
          title={"Customer"}
          value={customers}
        />
        <DashboardCard
          icon={
            <DollarCircleOutlined
              style={{
                color: "red",
                backgroundColor: "rgba(255,0,0,0.25)",
                borderRadius: 20,
                fontSize: 24,
                padding: 8,
              }} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            />
          }
          title={"Revenue"}
          value={revenue}
        />
      </Space>
      <Space>
        <RecentOrders />
        <DashboardChart />
      </Space>
    </Space>
  );
}

function DashboardCard({ title, value, icon }:{ title:any, value:any, icon:any }) {
  return (
    <Card>
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

function RecentOrders() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function getOrders(){
      await getOrderList()
        .then(res=>{
          if(res && !(res instanceof AxiosError)){
            if(res.data.data.length < 4){
              setDataSource(res.data.data);
            }else{
              setDataSource(res.data.data.splice(0, 3));
            }          
            setLoading(false);     
          }
        })
        .catch(error => console.error('request getOrders:', error)); 
    }
 
    getOrders();
 
  }, []);

  return (
    <>
      <Typography.Text>Recent Orders</Typography.Text>
      <Table
        columns={[
          {
            title: "Title",
            dataIndex: "OrderName",
          },
          {
            title: "Quantity",
            dataIndex: "OrderAmount",
          },
          {
            title: "Price",
            dataIndex: "UnitPrice",
          },
        ]}
        loading={loading}
        dataSource={dataSource}
        pagination={false}
      ></Table>
    </>
  );
}

function DashboardChart() {
  const [reveneuData, setReveneuData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    async function getProducts(){
      await getProductListNoPagination()
        .then(productList=>{
          if(productList && !(productList instanceof AxiosError)){
            const productData = productList.data.data;
            const labels = productData.map((item: { ProductName: any; }) => {
              return `Product-${item.ProductName}`;
            });
            const data = productData.map((item: { ProductNumber: any; }) => {
              return `${item.ProductNumber}`;
            });
            // const data = labels.map(() => productData.dataType.number({ min: 0, max: 1000 }))
            const dataSource:any = {
              labels,
              datasets: [
                {
                  label: "Inventory",
                  data: data,
                  backgroundColor: "rgba(53, 162, 235, 1)",
                },
              ],
            };
            setReveneuData(dataSource);
          }
        })
        .catch(error => console.error('request getProducts:', error)); 
    }
 
    getProducts();
  
  }, []);

  const options:any = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Product Inventory",
      },
      //the bar size
      scales: {
        xAxes: [
          {
            stacked: true,
            ticks: {
              padding: 5
            },
            gridLines: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            stacked: false,
            gridLines: {
              drawBorder: true
            },
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 6,
              padding: 20,
              callback(ProductNumber:any) {
                if (ProductNumber < 1e3) return ProductNumber;
                if (ProductNumber >= 1e3) return +(ProductNumber / 1e3).toFixed(1) + "K";
              }
            }
          }
        ]
      },
    },
  };

  return (
    <Card style={{ width: 500, height: 250 }}>
      <Bar options={options} data={reveneuData} />
    </Card>
  );
}
export default Dashboard;