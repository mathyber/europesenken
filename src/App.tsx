import React, {useEffect} from 'react';
import Footer from "./components/Footer";
import Header from "./components/Header";
import {APP_NAME} from "./constants/appSettings";
import './styles.scss';
import Content from "./components/Content";

const App = () => {
    useEffect(() => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, []);

    return (
        <div>
            <Header namePage={APP_NAME}/>
            <Content/>
            <Footer namePage={APP_NAME}/>
        </div>
    );
};

export default App;