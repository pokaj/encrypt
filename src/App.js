import { useState } from 'react';
import axios from 'axios';
const base64url = require('base64url');


function App(){

  let characters = "0123456789abcdef";
    let verifier = "";
    for(let i = 0; i < 40; i++){
      verifier += characters[Math.floor(Math.random() * 16)]
    }

    const challenge = base64url(verifier);
    localStorage.setItem('verifier', verifier);
    localStorage.setItem('challenge', challenge);

    axios.post('http://localhost:8000/oauth/authorize', {
      'challenge': challenge
    }).then(response => {localStorage.setItem('auth_url', response.data)});


  const [email, setEmail ]= useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    axios.post(localStorage.getItem('auth_url'), {email,password})
    .then(response=>console.log(
      axios.post(response.data, {'verifier':localStorage.getItem('verifier')}).then(
        response=>console.log(response)
      )
    ));


  }
  
  return (
    <div className="App">
    <h1>Login</h1>
      Email: <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/><br/>
      Password: <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/><br />
      <button onClick={login}>Submit</button>
    </div>
  );
}

export default App;
