import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Layout from './Components/LayoutArea/Layout/Layout';
import { BrowserRouter } from "react-router-dom";
import interceptorsService from './Services/InterceptorsService';
import socketIoService from './Services/SocketIoService';
// delete me 3
import { Provider } from "react-redux";
import vacationsStore from './Redux/Store';

interceptorsService.createInterceptors();
socketIoService.connect();

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
