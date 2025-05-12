import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const CatalogApp = React.lazy(() => import('catalog/App'));

function App() {
    return (
        <div>
            <Header />
            {/* <CatalogApp /> */}
            <Footer />
        </div>
    );
}

export default App;
