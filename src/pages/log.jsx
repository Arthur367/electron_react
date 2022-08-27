import React, { useEffect, useState } from 'react';
import { channels } from '../shared/constants';
import ipcrender from '../actions/ipcrender';
import Modal from 'react-modal';
import { calculateRange, sliceData } from '../utils/tablePagination';
import ReactJson from 'react-json-view';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import "react-datepicker/dist/react-datepicker.css";
import Stack from 'react-bootstrap/Stack';
import { DateRangePicker } from 'rsuite';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import './style.css';
import DatePicker from 'react-datepicker';
const { ipcRenderer } = window.require('electron');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    overflowX: 'scroll'
  },
};
Modal.setAppElement(document.getElementById('root'))
export default function Log() {
  let subtitle;
  const [logData, setLogData] = useState([]);
  const [logDataChange, setLogChange] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [responseDataChange, setResponseDataChange] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [requestDataChange, setRequestDataChange] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pagination, setPagination] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [requestInfo, setRequestInfo] = useState();
  const [key, setKey] = useState('home');
  const [startdate, setStartDate] = useState(new Date());
  const [enddate, setEndDate] = useState(new Date());
  const [dateFilterStarted, setFilterStarted] = useState(false);
  const [dateFilterData, setDateFilterData] = useState([]);
  const [dateFilterPagination, setDateFilterPagination] = useState([]);
  const [dateRequestPagination, setDateRequest] = useState([]);
  const [dateRespoonse, setDateResponse] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([new Date(), new Date()]);
  useEffect(() => {


    if (dateFilterStarted === true) {
      ipcrender.receiveDateFilter(startdate.getTime(), enddate.getTime()).then((value) => setDateFilterData(value)).catch((err) => console.log(err));
      if (key === 'home') {
        ipcrender.receiveDateLogPagination(startdate.getTime(), enddate.getTime(), page).then((value) => setDateFilterPagination(value)).catch((err) => ipcRenderer.removeAllListeners(channels.DATE_LOG_PAGINATION));
        ipcRenderer.removeAllListeners(channels.DATE_REQUEST_PAGINATION);
        ipcRenderer.removeAllListeners(channels.DATE_RESPONSE_PAGINATION);

      } else if (key === 'request') {
        ipcrender.receiveDateRequestPagination(startdate.getTime(), enddate.getTime(), page).then((value) => setDateRequest(value)).catch((err) => ipcRenderer.removeAllListeners(channels.DATE_REQUEST_PAGINATION));

        ipcRenderer.removeAllListeners(channels.DATE_LOG_PAGINATION);
        ipcRenderer.removeAllListeners(channels.DATE_RESPONSE_PAGINATION)
      } else if (key === 'response') {
        ipcrender.receiveDateResponsePagination(startdate.getTime(), enddate.getTime(), page).then((value) => setDateResponse(value)).catch((err) => ipcRenderer.removeAllListeners(channels.DATE_RESPONSE_PAGINATION));
        ipcRenderer.removeAllListeners(channels.DATE_REQUEST_PAGINATION);
        ipcRenderer.removeAllListeners(channels.DATE_LOG_PAGINATION)
      }
      ipcRenderer.removeAllListeners(channels.RECEIVE_LOG_PAGINATION);
      ipcRenderer.removeAllListeners(channels.RECEIVE_LOG_PAGINATION);
      ipcRenderer.removeAllListeners(channels.RECEIVE_RESPONSE_PAGINATION)
      ipcRenderer.removeAllListeners(channels.RECEIVE_LOG);
      setPagination(calculateRange(dateFilterData, 5));
    } else {
      if (key === 'home') {
        ipcrender.getLogData().then((value) => {
          setLogData(value)
          ipcrender.RequestLogPagination(page).then((value) => {
            setLogChange(value);
          }).catch((err) =>
            ipcRenderer.removeAllListeners(channels.RECEIVE_LOG_PAGINATION)
          );
        }).catch((err) => ipcRenderer.removeAllListeners(channels.RECEIVE_LOG));
        ipcRenderer.removeAllListeners(channels.RECEIVE_REQUEST_PAGINATION);
        ipcRenderer.removeAllListeners(channels.RECEIVE_RESPONSE_PAGINATION);

      } else if (key === 'request') {
        ipcrender.receiveRequestPagination(page).then((value) => {
          setRequestDataChange(value)
        }).catch((err) => {
          ipcRenderer.removeAllListeners(channels.RECEIVE_REQUEST_PAGINATION)
        });
        ipcRenderer.removeAllListeners(channels.RECEIVE_LOG_PAGINATION);
        ipcRenderer.removeAllListeners(channels.RECEIVE_RESPONSE_PAGINATION)
      } else if (key === 'response') {
        ipcrender.receiveResponsePagination(page).then((value) => {
          setResponseDataChange(value);
        }).catch(() => ipcRenderer.removeAllListeners(channels.RECEIVE_RESPONSE_PAGINATION));
        ipcRenderer.removeAllListeners(channels.RECEIVE_REQUEST_PAGINATION);
        ipcRenderer.removeAllListeners(channels.RECEIVE_LOG_PAGINATION)
      }
      ipcRenderer.removeAllListeners(channels.DATE_FILTER)
      ipcRenderer.removeAllListeners(channels.DATE_LOG_PAGINATION);
      ipcRenderer.removeAllListeners(channels.DATE_REQUEST_PAGINATION);
      ipcRenderer.removeAllListeners(channels.DATE_RESPONSE_PAGINATION);

      setPagination(calculateRange(logData, 5));

    }

  }, [logData, key, page, requestDataChange, requestDataChange]);

  const openModal = (data) => {
    setIsOpen(true);
    setRequestInfo({ data });
  }

  const handleStartDate = (date) => {
    setStartDate(date);


  }
  const handleEndDate = (date) => {
    setEndDate(date);

  }
  const startFilter = () => {
    setFilterStarted(true);
    setShow(!show);

  }

  const clearFilter = () => {
    setFilterStarted(false);
    setShow(!show);
  }


  const afterOpenModal = (data) => {

  }
  const closeModal = () => {
    setIsOpen(false);
  }

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
      __handleChangePage(0);
    }
  };

  // Change Page 
  const __handleChangePage = (new_page) => {
    setPage(new_page);
    ipcrender.RequestLogPagination(new_page).then((value) => {
      setLogChange(value);
    }).catch((err) => console.log(err));
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">DateRangePicker</Popover.Header>
      <Popover.Body>
        <Stack direction="horizontal" gap={2}>
          <div className="bg-light border">
            <p style={{ "color": "black" }}>From: </p>
            <DatePicker onChange={(e) => handleStartDate(e)} selected={startdate} /></div>
          <div className="bg-light border">
            <p style={{ "color": "black" }}>To: </p>
            <DatePicker onChange={(e) => handleEndDate(e)} selected={enddate} />
          </div>
        </Stack>
        <Stack direction="horizontal" gap={2}>
          <div className="bg-light border">
            <Button variant="success" onClick={() => startFilter()}>Okay</Button>
          </div>
          <div className="bg-light border">
            <Button variant="success" onClick={() => clearFilter()}>Clear</Button>
          </div>
        </Stack>

      </Popover.Body>
    </Popover>
  );
  const handleShowPopup = () => {
    setShow(!show);
  }



  if (dateFilterStarted === true) {
    return (
      <Container fluid>
        <Container fluid style={{ "overflowX": "scroll", "width": "80%", "height": "80%" }}>
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
          </div>
          <>
            <OverlayTrigger show={show} placement="right" overlay={popover}>
              <Button variant="success" onClick={handleShowPopup}>Date Filter</Button>
            </OverlayTrigger>
          </>
          <Tabs
            id="uncontrolled-tab-example"
            className="mb-3"
            activeKey={key}
            onSelect={(k) => setKey(k)}>
            <Tab eventKey="home" title="All">
              {/* <div className="container" id="container" style={{ "overflowX": "scroll", "width": "100%" }}> */}
              <Table responsive>
                <thead>
                  <th>#</th>
                  <th>Created Invoice No</th>
                  <th>Created Date</th>
                  <th>Auth Headers</th>
                  <th>Device</th>
                  <th>End Point</th>
                  <th>Request Date Time</th>
                  <th>Request Body</th>
                  <th>Response Type</th>
                  <th>Response Time</th>
                  <th>Response Body</th>

                </thead>

                {dateFilterPagination.length !== 0 ?
                  <tbody>
                    {dateFilterPagination.map((e, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{e.request?.request_data?.invoice_number}</td>
                        <td>{e.request?.request_data?.invoice_date}</td>
                        <td>{e.request?.method}</td>
                        <td>{e.request?.device}</td>
                        <td>{e.request?.url}</td>
                        <td>{e.request?.time}</td>
                        <td><span onClick={() => openModal(e.request.request_data)}>{e.request != null ? "RequestData" : ""}</span></td>
                        <td>{e.response?.statusCode !== 200 ? "Failure" : "Successfull"} </td>
                        <td>{e.response?.statusTime} </td>
                        <td><span onClick={() => openModal(e.response.data)}>{e.response != null ? "ResponseBody" : ""}</span></td>
                      </tr>
                    ))}
                  </tbody>
                  : null}
              </Table>
              {/* </div> */}
            </Tab>
            <Tab eventKey="request" title="Requests">

              <Table responsive>
                <thead>
                  <th>#</th>
                  <th>Created Invoice No</th>
                  <th>Created Date</th>
                  <th>Auth Headers</th>
                  <th>End Point</th>
                  <th>Request Date Time</th>
                  <th>Request Body</th>
                </thead>

                {dateRequestPagination.length !== 0 ?
                  <tbody>
                    {dateRequestPagination.map((e, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{e.request?.request_data?.invoice_number}</td>
                        <td>{e.request?.request_data?.invoice_date}</td>
                        <td>{e.request?.method}</td>
                        <td>{e.request?.url}</td>
                        <td>{e.request?.time}</td>
                        <td><span onClick={() => openModal(e.request.request_data)}>{e.request != null ? "RequestData" : ""}</span></td>

                      </tr>
                    ))}
                  </tbody>
                  : null}
              </Table>
            </Tab>
            <Tab eventKey="response" title="Response">
              {/* <Sonnet /> */}
              <Table responsive>
                <thead>
                  <th>#</th>
                  <th>Response Type</th>
                  <th>Response Time</th>
                  <th>Response Body</th>
                </thead>

                {dateRespoonse.length !== 0 ?
                  <tbody>
                    {dateRespoonse.map((e, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{e.response?.statusCode !== 200 ? "Failure" : "Successfull"} </td>
                        <td>{e.response?.statusTime} </td>
                        <td><span onClick={() => openModal(e.response.data)}>{e.response != null ? "ResponseBody" : ""}</span></td>

                      </tr>
                    ))}
                  </tbody>
                  : null}
              </Table>
            </Tab>
          </Tabs>


          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Request Data"
          >
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
            <button onClick={closeModal}>close</button>
            <div>Request Data</div>
            <ReactJson src={requestInfo} theme="rjv-default"></ReactJson>
            {/* <pre className='pre'>{JSON.stringify(requestInfo, null, 2)}</pre> */}
          </Modal>

          {dateFilterData.length !== 0 ?
            <div className='dashboard-content-footer'>
              {pagination.map((item, index) => (
                <span
                  key={index}
                  className={item === page ? 'active-pagination' : 'pagination'}
                  onClick={() => __handleChangePage(item)}>
                  {item + 1}
                </span>
              ))}
            </div>
            :
            <div className='dashboard-content-footer'>
              <span className='empty-table'>No data</span>
            </div>
          }
        </Container>


      </Container>
    )

  } else {
    return (
      <Container fluid>
        <Container fluid style={{ "overflowX": "scroll", "width": "80%", "height": "80%" }}>
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
          </div>
          <>
            <OverlayTrigger show={show} placement="right" overlay={popover}>
              <Button variant="success" onClick={handleShowPopup}>Date Filter</Button>
            </OverlayTrigger>
          </>
          <Tabs
            id="uncontrolled-tab-example"
            className="mb-3"
            activeKey={key}
            onSelect={(k) => setKey(k)}>
            <Tab eventKey="home" title="All">
              {/* <div className="container" id="container" style={{ "overflowX": "scroll", "width": "100%" }}> */}
              <Table responsive>
                <thead>
                  <th>#</th>
                  <th>Created Invoice No</th>
                  <th>Created Date</th>
                  <th>Auth Headers</th>
                  <th>Device</th>
                  <th>End Point</th>
                  <th>Request Date Time</th>
                  <th>Request Body</th>
                  <th>Response Type</th>
                  <th>Response Time</th>
                  <th>Response Body</th>

                </thead>

                {logDataChange.length !== 0 ?
                  <tbody>
                    {logDataChange.map((e, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{e.request?.request_data?.invoice_number}</td>
                        <td>{e.request?.request_data?.invoice_date}</td>
                        <td>{e.request?.method}</td>
                        <td>{e.request?.device}</td>
                        <td>{e.request?.url}</td>
                        <td>{e.request?.time}</td>
                        <td><span onClick={() => openModal(e.request.request_data)}>{e.request != null ? "RequestData" : ""}</span></td>
                        <td>{e.response?.statusCode !== 200 ? "Failure" : "Successfull"} </td>
                        <td>{e.response?.statusTime} </td>
                        <td><span onClick={() => openModal(e.response.data)}>{e.response != null ? "ResponseBody" : ""}</span></td>
                      </tr>
                    ))}
                  </tbody>
                  : null}
              </Table>
              {/* </div> */}
            </Tab>
            <Tab eventKey="request" title="Requests">

              <Table responsive>
                <thead>
                  <th>#</th>
                  <th>Created Invoice No</th>
                  <th>Created Date</th>
                  <th>Auth Headers</th>
                  <th>End Point</th>
                  <th>Request Date Time</th>
                  <th>Request Body</th>
                </thead>

                {requestDataChange.length !== 0 ?
                  <tbody>
                    {requestDataChange.map((e, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{e.request?.request_data?.invoice_number}</td>
                        <td>{e.request?.request_data?.invoice_date}</td>
                        <td>{e.request?.method}</td>
                        <td>{e.request?.url}</td>
                        <td>{e.request?.time}</td>
                        <td><span onClick={() => openModal(e.request.request_data)}>{e.request != null ? "RequestData" : ""}</span></td>

                      </tr>
                    ))}
                  </tbody>
                  : null}
              </Table>
            </Tab>
            <Tab eventKey="response" title="Response">
              {/* <Sonnet /> */}
              <Table responsive>
                <thead>
                  <th>#</th>
                  <th>Response Type</th>
                  <th>Response Time</th>
                  <th>Response Body</th>
                </thead>

                {responseDataChange.length !== 0 ?
                  <tbody>
                    {responseDataChange.map((e, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{e.response?.statusCode !== 200 ? "Failure" : "Successfull"} </td>
                        <td>{e.response?.statusTime} </td>
                        <td><span onClick={() => openModal(e.response.data)}>{e.response != null ? "ResponseBody" : ""}</span></td>

                      </tr>
                    ))}
                  </tbody>
                  : null}
              </Table>
            </Tab>
          </Tabs>


          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Request Data"
          >
            <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
            <button onClick={closeModal}>close</button>
            <div>Request Data</div>
            <ReactJson src={requestInfo} theme="rjv-default"></ReactJson>
            {/* <pre className='pre'>{JSON.stringify(requestInfo, null, 2)}</pre> */}
          </Modal>

          {logData.length !== 0 ?
            <div className='dashboard-content-footer'>
              {pagination.map((item, index) => (
                <span
                  key={index}
                  className={item === page ? 'active-pagination' : 'pagination'}
                  onClick={() => __handleChangePage(item)}>
                  {item + 1}
                </span>
              ))}
            </div>
            :
            <div className='dashboard-content-footer'>
              <span className='empty-table'>No data</span>
            </div>
          }
        </Container>


      </Container>
    )
  }
}
