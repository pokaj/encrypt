import { useState } from 'react';
import axios from 'axios';
// const base64url = require('base64url');
import { encode, decode } from 'js-base64';



function App(){

  let characters = "0123456789abcdef";
    let verifier = "";
    for(let i = 0; i < 40; i++){
      verifier += characters[Math.floor(Math.random() * 16)]
    }

    const challenge = encode(verifier);
    console.log(verifier);
    console.log(challenge);
    localStorage.setItem('verifier', verifier);
    localStorage.setItem('challenge', challenge);

    axios.post('http://localhost:8000/oauth/authorize', {
      'challenge': challenge
    }).then(response => {localStorage.setItem('auth_url', response.data)});


  const [email, setEmail ]= useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    axios.post(localStorage.getItem('auth_url'), {email,password})
    .then(response=>
      axios.post('http://localhost:8000/oauth/verify', 
      {
        'verifier':localStorage.getItem('verifier'), 
        'auth_code': response.data.auth_code
      }).then(
        response=>console.log(response)
      )
    );
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
