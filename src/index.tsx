import './index.css';
import { render } from 'solid-js/web';

import { App } from './App';
import { Router, hashIntegration, Route, Routes } from '@solidjs/router';
import { FontDetails } from './page/FontDetails';
import { PackageDetails } from './page/PackageDetails';
import { SearchPage } from './page/SearchPage';
import { GoogleFont } from './GoogleSupport/Google';
import { GoogleFontDetailed } from './GoogleSupport/GoogleFontDetailed';

render(() => {
    return (
        <>
            <Router source={hashIntegration()}>
                <Routes>
                    <Route path="/" element={App}></Route>
                    <Route path="/search" element={SearchPage}></Route>
                    <Route path="/fonts/:packageName" element={PackageDetails}></Route>
                    <Route path="/fonts/:packageName/:fontName" element={FontDetails}></Route>
                    <Route path="/google" element={GoogleFont}></Route>
                    <Route path="/google/:packageName" element={GoogleFontDetailed}></Route>
                </Routes>
            </Router>
        </>
    );
}, document.getElementById('root') as HTMLElement);
