import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header';
import Rides from './components/rides';

function App() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    axios.get("http://assessment.api.vweb.app/user")
      .then(res => {
        setUser(res.data);
      })

  }, [])
  return (
    <div className="App">
      <Header user={user} />
      <Rides user={user} />
    </div>
  );
}

export default App;
