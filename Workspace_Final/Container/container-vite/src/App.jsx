import React from 'react';
import Header from './components/Header';

const CatalogApp = React.lazy(() => import('catalog/App'));

function App() {
    return (
        <div>
            <Header />
            {/* <CatalogApp /> */}
        </div>
    );
}

export default App;
