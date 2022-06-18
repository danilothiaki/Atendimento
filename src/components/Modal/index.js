import './modal.css';
import { FiX } from 'react-icons/fi';
import firebase from "../../services/firebaseConnection";
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

export default function Modal({conteudo, close, acao}){

    // const history = useHistory();
    // const refresh = () => {
    //     history.replace("/empty");
    //     setTimeout(() => {
    //       history.replace("/dashboard");
    //     }, 10);
    //   };

    async function excluirChamado(conteudo){

        // await firebase.firestore().collection('chamados')
        // .doc(conteudo.id)
        // .update({
        //     excluido: true
        // })
        // .then(()=>{
        //     toast.success('Excluido com sucesso');
        //     close();
        //     window.location.reload();
        // })
        // .catch(()=>{
        //     alert('erro');
        // })

        await firebase.firestore().collection('chamados')
        .doc(conteudo.id)
        .delete()
        .then(()=>{
            close();
            window.location.reload();
            toast.success('Excluido com sucesso');
        })
        .catch(()=>{
            alert('erro');
        })
    }

    return(

        <div className='modal'>
            {acao === 'detalhes'  ? (
            <div className='container'>

            <button className="close" onClick={ close }>
                <FiX size={23} color="#FFF" />
                Fechar
            </button>

                    
                        <div>
                        <h2>Detalhes do chamado</h2>

                        <div className='row'>
                            <span>
                                Cliente: <a>{conteudo.cliente}</a>
                            </span>
                        </div>

                        <div className='row'>
                            <span>
                                Assunto: <a>{conteudo.assunto}</a>
                            </span>
                            <span>
                                Cadastrado em: <a>{conteudo.dataMascara}</a>
                            </span>
                        </div>

                        <div className='row'>
                            <span>
                                Status: <a style={{ color: '#FFF', backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999'}}>{conteudo.status}</a>
                            </span>
                        </div>

                        {conteudo.complemento !== '' && (
                            <>
                            <h3>Complemento</h3>
                            <p>
                                {conteudo.complemento}
                            </p>
                            </>
                        )}
                        
                    </div>
                    </div>
                    ) : (
                        <div className='container-excluir'>

            <button className="close" onClick={ close }>
                <FiX size={23} color="#FFF" />
                Fechar
            </button>


                        <div>
                            <h2>Deseja excluir?</h2>

                            
                            <div className='row div-botao'>
                             
                            <button className='sim-btn' onClick={() => excluirChamado(conteudo) }>Sim</button>
                            <button className='nao-btn' onClick={ close }>Não</button>
                        </div>

                        </div>
                        </div>
                    )}


                    

            
        </div>
    )
}