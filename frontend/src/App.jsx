import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import './styles/App.css';

const App = () => {
    const [useWebSocket, setUseWebSocket] = useState(true);

    const toggleDataRetrievalMethod = () => {
        setUseWebSocket(prev => !prev);
    };

    return (
        <div className="App">
            <Dashboard useWebSocket={useWebSocket} />
        </div>
    );
};

export default App;