import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from '../../components/Header';
import './dashboard.css';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2, FiX } from 'react-icons/fi';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import { format } from 'date-fns';
import Modal from '../../components/Modal';


//listaRef feito fora da function, para ser chamado em outros lugares
const listaRef = firebase.firestore().collection('chamados').orderBy('create', 'desc');

export default function Dashboard(){

    const [chamados, setChamados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [carregando2, setCarregando2] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [ultimoChamados, setUltimoChamados] = useState();
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
    const [detalhes, setDetalhes] = useState();
    const [excluir, setExcluir] = useState();
    const [status, setStatus] = useState('');
    const [carregarFiltro, setCarregarFiltro] = useState(false);


    useEffect(()=> {
        
        carregarChamadas();
    }, []);


    async function carregarChamadas(){
        await listaRef.where('excluido', '==', false)
        .limit(5)
        .get()
        .then((result)=>{

            preencherGrid(result);
            //let lista = [];

            // result.forEach((item)=>{
            //     lista.push({
            //         cliente: item.data().cliente,
            //         assunto: item.data().assunto,
            //         status: item.data().status,
            //         data: item.data().create
            //     })
            // })

            // if (lista.length === 0){
            //     alert('Nenhum chamado encontrado');
            // }

            //setChamados(lista);
        })
        .catch((erro)=>{
            alert('erro linha 63');
            console.log(erro);
            setCarregando2(false);
        })

        setCarregando(false);

    }

    //criado fora do useEffect, para pode ser chamado em outras partes
     async function preencherGrid(result){
        //retorna um booleano se a lista estiver vazia
        const contemLista = result.size === 0;

        if (!contemLista){
            let lista = [];

            result.forEach((item)=>{
                lista.push({
                    id: item.id,
                    cliente: item.data().cliente,
                    clienteId: item.data().clienteId,
                    assunto: item.data().assunto,
                    status: item.data().status,
                    data: item.data().create,
                    dataMascara: format(item.data().create.toDate(), 'dd/MM/yyyy'),
                    complemento: item.data().complemento
                })
            })

            const ultimoChamado = result.docs[result.docs.length -1];

            setChamados(chamados1 => [...chamados, ...lista]);
            setUltimoChamados(ultimoChamado);
        }else{
            setIsEmpty(true);
        }

        //boolenaod para avisar que não tem mais nada para ser carregado
        setCarregando2(false);
    }   

    async function buscarMaisChamados(){
        setCarregando2(true);
        await listaRef.startAfter(ultimoChamados).limit(5)
        .get()
        .then((result)=>{
            preencherGrid(result);
        })
    }

    function modalDetalhes(item){
        setMostrarModal(!mostrarModal);//ira trocar toda vez que abrir a modal
        setDetalhes(item);
 
    }

    function modalExcluir(item){
        setMostrarModalExcluir(!mostrarModalExcluir);//ira trocar toda vez que abrir a modal
        setExcluir(item);

    }




    async function mudarChamadasPorStatus(status){
        setStatus(status);
        if (status !== 'Status'){
            listaRef.where('status', '==', status)
            .get()
            .then((result)=>{
                setCarregarFiltro(true);
                setChamados({});
                
                // const rows = [...chamados];
                // rows.splice(1, 5);
                //setRowsData(rows);



                //carregarChamadas();
                let novaLista = chamados.filter((item) => { return(item.status == status)})
                setChamados(result);
                preencherGrid(result);


                setCarregarFiltro(false);
            })
            .catch((error)=>{
                console.log(error);
            })
        }
        
    }


    if(carregando){
        return(
            <div>
                <Header/>
                <div className='content'>
                    <Title name='Atendimentos'>
                        <FiMessageSquare size={25}/>
                    </Title>
                </div>

                <div className="container dashboard">
                    <span>Carregando chamados...</span>
                </div>
            </div>
        )
    }


    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name='Atendimentos'>
                    <FiMessageSquare size={25}/>
                </Title>

                {chamados.length === 0 && carregarFiltro === false ? (
                <div className="container dashboard">
                    <span>Nenhum chamado registrado...</span>

                    <Link to='/new' className="new">
                        <FiPlus size={25} color='#FFF'/>
                        Novo chamado
                    </Link>
                </div>
                ) : (
                    <div >
                    {/* <span>Nenhum chamado registrado...</span> */}
                    {/* <select value={assunto} onChange={onChangeAssunto}>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita Tecnica'>Visita Tecnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select> */}


                        <select value={status} onChange={e => mudarChamadasPorStatus(e.target.value)}>
                            <option value='Status'>Status</option>
                            <option value='Aberto'>Aberto</option>
                            <option value='Andamento'>Andamento</option>
                            <option value='Concluido'>Concluido</option>
                        </select>


                    <Link to='/new' className="new">
                        <FiPlus size={25} color='#FFF'/>
                        Novo chamado
                    </Link>

                    <table className="tabela">
                        <thead>
                            <tr>
                                <th scope="col">Clientes</th>
                                <th scope="col">Assunto</th>
                                <th scope="col">Status</th>
                                <th scope="col">Cadastrado em</th>
                                <th scope="col">Ação</th>
                            </tr>
                        </thead>
                        <tbody>

                            {chamados.map((item, index)=>{
                                // if (status !== 'Status' && item.status === status)
                            return(
                                
                            <tr key={index}>
                                {/* {status !== 'Status' && (

                                ) } */}
                                <td data-label='Cliente'>{item.cliente}</td>
                                <td data-label='Assunto'>{item.assunto}</td>
                                <td data-label='Status'>
                                <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>{item.status}</span>
                                    {/* <span className='badge' style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999'}}>{item.status}</span> */}
                                </td>
                                <td data-label='Cadastrado'>{item.dataMascara}</td>
                                <td data-label='#'>
                                    <button title="Detalhes do chamado" className="action" style={{backgroundColor: '#3583f6'}}  onClick={() => modalDetalhes(item)}>
                                        <FiSearch color="#fff" size={17}/>
                                    </button>
                                    <Link title="Editar chamado" className="action" style={{backgroundColor: '#F6a935'}} to={`/new/${item.id}`}>
                                        <FiEdit2 color="#fff" size={17}/>
                                    </Link>

                                    <button title="Excluir chamado" className="action" style={{backgroundColor: '#ff0000'}}  onClick={() => modalExcluir(item)}>
                                        <FiX color="#fff" size={17}/>
                                    </button>
                                   
                                    
                                </td>
                            </tr>
                                )
                            })}

                            
                        </tbody>
                    </table>

                    {carregando2 && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando chamados</h3>}
                    {/*Se não estiver carregando a grid e a grid não estiver vazia, aparecer o botão*/ }
                    { !carregando2 && !isEmpty && <button className="btn-carregar" onClick={buscarMaisChamados} >Carregar chamados</button> }

                </div>

                )}
 
            </div>

            {mostrarModal && (
                <Modal 
                    conteudo={detalhes} 
                    close={modalDetalhes}
                    acao={'detalhes'}
                />
            )}

            {mostrarModalExcluir && (
                <Modal 
                    conteudo={excluir} 
                    close={modalExcluir}
                    acao={'excluir'}
                />
            )}

            
        </div>
        
        

    )
}