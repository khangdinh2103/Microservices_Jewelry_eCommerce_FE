import React from 'react';
import './App.css';
import Header from './components/Header';

const RemoteApp = React.lazy(() => import('catalog/App'));

function App() {
    return (
        <div>
            <Header />
            <RemoteApp />
        </div>
    );
}

export default App;
