import React, { useEffect, useState } from 'react';
import { channels } from '../shared/constants';
import Table from 'react-bootstrap/Table';
import storedbdata from '../storedbdata';
import ipcrender from '../actions/ipcrender';
import { calculateRange, sliceData } from '../utils/tablePagination';
import './table.css';
import DashboardHeader from '../components/DashboardHeader';
const { ipcRenderer } = window.require('electron');


export default function Log() {
  const [logData, setLogData] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);


  useEffect(() => {
    ipcrender.getLogData().then((value) => {
      setLogData(value)
    }).then(() => {
      ipcRenderer.removeAllListeners(channels.RECEIVE_LOG)
    }).catch((err) => console.log(err));
    ipcrender.getRequestData().then((value) => {
      setRequestData(value);
    }).catch((err) => console.log(err));
    ipcrender.getResponse().then((value) => {
      setResponseData(value);
    }).catch((err) => console.log);
    setPagination(calculateRange(logData, 5));
    setLogData(sliceData(logData, page, 5));
  }, []);
  console.log(logData);

  console.log(requestData);
  console.log(responseData);
  const __handleSearch = (event) => {
    setSearch(event.target.value);
    if (event.target.value !== '') {
      // let search_results = orders.filter((item) =>
      //   item.first_name.toLowerCase().includes(search.toLowerCase()) ||
      //   item.last_name.toLowerCase().includes(search.toLowerCase()) ||
      //   item.product.toLowerCase().includes(search.toLowerCase())
      // );
      // setOrders(search_results);
    }
    else {
      __handleChangePage(1);
    }
  };

  // Change Page 
  const __handleChangePage = (new_page) => {
    // setPage(new_page);
    // setOrders(sliceData(all_orders, new_page, 5));
  }

  return (
    <div className='dashboard-content'>
      {/* <DashboardHeader
        btnText="New Order" /> */}
      <div className='dashboard-content-container'>
        <div className='dashboard-content-header'>
          <h2>Log Data</h2>
          <div className='dashboard-content-search'>
            <input
              type='text'
              value={search}
              placeholder='Search..'
              className='dashboard-content-input'
              onChange={e => __handleSearch(e)} />
          </div>
        </div>

        <table>
          <thead>
            <th>#</th>
            <th>Tally Invoice No</th>
            <th>Tally Date</th>
            <th>Auth Headers</th>
            <th>End Point</th>
            <th>Request Date Time</th>
            <th>Request Body</th>
            <th>Response Type</th>
            <th>Response Time</th>
            <th>Response Body</th>
          </thead>

          {logData.length !== 0 ?
            <tbody>
              {logData.map((e, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{e.request?.request_data?.invoice_number}</td>
                  <td>{e.request?.request_data?.invoice_date}</td>
                  <td>{e.request?.method}</td>
                  <td>{e.request?.url}</td>
                  <td>{e.request?.time}</td>
                  <td>{e.request != null ? "RequestData" : ""}</td>
                  <td>{e.response?.statusCode !== 200 ? "Failure" : "Successfull"} </td>
                  <td>{e.response?.time} </td>
                  <td>{e.response != null ? "ResponseBody" : ""}</td>
                </tr>
              ))}
            </tbody>
            : null}
        </table>

        {logData.length !== 0 ?
          <div className='dashboard-content-footer'>
            {pagination.map((item, index) => (
              <span
                key={index}
                className={item === page ? 'active-pagination' : 'pagination'}
                onClick={() => __handleChangePage(item)}>
                {item}
              </span>
            ))}
          </div>
          :
          <div className='dashboard-content-footer'>
            <span className='empty-table'>No data</span>
          </div>
        }
      </div>
    </div>
  )
}
