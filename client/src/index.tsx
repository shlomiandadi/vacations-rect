import ReactDOM from 'react-dom';
import React from 'react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Layout from './Components/LayoutArea/Layout/Layout';
import { BrowserRouter } from "react-router-dom";
import interceptorsService from './Services/InterceptorsService';
import socketIoService from './Services/SocketIoService';
import { Provider } from "react-redux";
import vacationsStore from './Redux/Store';
// import * as ReactDOM from 'react-dom/client';


interceptorsService.createInterceptors();
socketIoService.connect();

// const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
// root.render(
//     <React.StrictMode>
//         <BrowserRouter>
//             <Provider store={vacationsStore}>
//                 <Layout />
//             </Provider>
//         </BrowserRouter>
//     </React.StrictMode>
// );


ReactDOM.render(

    <BrowserRouter>
        <Provider store={vacationsStore}>
            <Layout />
        </Provider>
    </BrowserRouter>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
