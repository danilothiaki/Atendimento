import { useState, useContext } from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';

function SignUp() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function submit(e){
    e.preventDefault();//evento para não dar o refresh na página

    if (nome !== '' && email !== '' && senha !== ''){
      signUp(nome, email, senha);
    }
  }

    return (
      <div className='container-center'>
        <div className='login'>
          <div className='login-area'>
            <img src={logo} alt='Logo' />
          </div>

          <form onSubmit={submit}>
            <h1>Criar nova conta</h1>
            <input type='text' placeholder='Nome' value={nome} onChange={(e) => setNome(e.target.value)}/>
            <input type='text' placeholder='email@email.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type='password' placeholder='******' value={senha} onChange={(e) => setSenha(e.target.value)}/>
            <button type='submit'>{loadingAuth ? 'Carregando...' : 'Criar Conta'}</button>
          </form>

          <Link to='/'>Fazer Login</Link>
        </div>
      </div>
    );
  }
  
  export default SignUp;
  