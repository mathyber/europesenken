import React, {useEffect} from 'react';
import Footer from "./components/Footer";
import Header from "./components/Header";
import {APP_NAME} from "./constants/appSettings";
import './styles.scss';
import Content from "./components/Content";

const App = () => {
    function appHeight() {
        const doc = document.documentElement
        doc.style.setProperty('--vh', (window.innerHeight*.01) + 'px');
    }

    window.addEventListener('resize', appHeight);
    appHeight();

    return (
        <div>
            <Header namePage={APP_NAME}/>
            <Content/>
            <Footer namePage={APP_NAME}/>
        </div>
    );
};

export default App;