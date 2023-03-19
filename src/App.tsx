import React from 'react';
import Footer from "./components/Footer";
import Header from "./components/Header";
import {APP_NAME} from "./constants/appSettings";

const App = () => {
    return (
        <div>
            <Header namePage={APP_NAME}/>
            <Footer namePage={APP_NAME}/>
        </div>
    );
};

export default App;