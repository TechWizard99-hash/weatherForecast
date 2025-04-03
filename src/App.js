import React from 'react';
import WeatherApp from "./Components/WeatherApp";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Footer from "./Components/Footer";
function App() {
  return (
    <div>
      <Header/>
      <Sidebar />
      <div className="main-content">
                <WeatherApp />
            </div>
            <Footer />
    </div>
  );
}

export default App;
