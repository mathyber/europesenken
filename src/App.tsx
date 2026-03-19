import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Footer from "./components/Footer";
import Header from "./components/Header";
import {APP_NAME} from "./constants/appSettings";
import './styles.scss';
import Content from "./components/Content";
import Scoreboard from "./components/Scoreboard";

const App = () => {
    return (
        <div>
            <Header namePage={APP_NAME}/>
            <Routes>
                <Route path="/" element={<Content />} />
                <Route path="/scoreboard" element={<Scoreboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer namePage={APP_NAME}/>
        </div>
    );
};

export default App;
