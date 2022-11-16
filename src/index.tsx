import './index.css';
import { render } from 'solid-js/web';

import { App } from './App';
import { Router, hashIntegration, Route, Routes } from '@solidjs/router';
render(() => {
    return (
        <>
            <Router source={hashIntegration()}>
                <Routes>
                    <Route path="/" element={App}></Route>
                </Routes>
            </Router>
        </>
    );
}, document.getElementById('root') as HTMLElement);
