import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StockData from './StockData';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Stock's Future</h1>
                    <h2>Voir les données boursières de grandes entreprises et leurs prédictions</h2>

                    <nav>
                        <ul>
                            <li><Link to="/StockData/NVDA">NVIDIA</Link></li>
                            <li><Link to="/StockData/AAPL">Apple</Link></li>
                            <li><Link to="/StockData/AMZN">Amazon</Link></li> {/* J'ai modifié "Amazon" en "AMZN" pour correspondre au symbole boursier réel d'Amazon */}
                            <li><Link to="/StockData/MSFT">Microsoft</Link></li> {/* J'ai modifié "Microsoft" en "MSFT" pour correspondre au symbole boursier réel de Microsoft */}
                            <li><Link to="/StockData/GOOGL">Google</Link></li> {/* J'ai modifié "Google" en "GOOGL" pour correspondre au symbole boursier réel de Alphabet (Google) */}
                            {/* Ajoutez d'autres entreprises si nécessaire */}
                        </ul>
                    </nav>
                </header>
                <Routes>
                    <Route path="/StockData/:stockSymbol" element={<StockData />} /> {/* Modification ici pour utiliser `stockSymbol` */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
