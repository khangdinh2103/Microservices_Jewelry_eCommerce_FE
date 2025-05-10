import React from 'react';
import './App.css';

const RemoteApp = React.lazy(() => import('account/App'));

function App() {
    return (
        <div>
            <h1>Container</h1>
            <React.Suspense fallback="Loading Account App">
                <RemoteApp />
            </React.Suspense>
        </div>
    );
}

export default App;
