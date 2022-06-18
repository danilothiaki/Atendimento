import { useState, useContext, useEffect} from "react";
import { useHistory, useParams } from 'react-router-dom'
import { AuthContext } from "../../contexts/auth";
import Header from '../../components/Header';
import './new.css';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import firebase from "../../services/firebaseConnection";
import { toast } from "react-toastify";


export default function New(){
    
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');
    const [carregarDDLClientes, setCarregarDDLClientes] = useState(true);
    const [cliente, setCliente] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(0);
    const [idUsuario, setIdUsuario] = useState(false);

    const { user } = useContext(AuthContext);

    const { id } = useParams();//pega o id do link
    const history = useHistory();

    useEffect(()=>{
        async function carregarClientes(){
            await firebase.firestore().collection('customers')
            .get()
            .then((result)=>{
                let lista = [];

                result.forEach((item)=>{
                    lista.push({
                        id: item.id,
                        nomeFantasia: item.data().nomeFantasia
                    })
                })

                if(lista.length === 0){
                    alert('nenhuma empresa encontrada');
                    setCarregarDDLClientes(false);
                    setCliente([{id:'1', nomeFantasia: 'teste'}]);
                    return;
                }

                setCliente(lista);
                setCarregarDDLClientes(false);

    
                if (id){
                    carregarId(lista);
                }


            })
            .catch((error)=>{
                setCarregarDDLClientes(false);
                setCliente([{id:'1', nomeFantasia: 'teste'}]);
            })
        }

        carregarClientes();
    }, [])


    async function carregarId(lista){
        await firebase.firestore().collection('chamados')
        .doc(id)
        .get()
        .then((result)=>{
            setAssunto(result.data().assunto);
            setStatus(result.data().status);
            setComplemento(result.data().complemento);

            let index = lista.findIndex(item => item.id === result.data().clienteId);
            setClienteSelecionado(index);

            //setando true para dizer que está edidando um usuário
            setIdUsuario(true);


        })
    }

    async function gravarChamado(e){
        e.preventDefault();

        if(idUsuario){
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: cliente[clienteSelecionado].nomeFantasia,
                clienteId: cliente[clienteSelecionado].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid,
                excluido: false
            })
            .then(() => {
                toast.success('Chamado atualizado com sucesso!');
                setComplemento('');
                setAssunto('Suporte');
                setStatus('Aberto');
                setClienteSelecionado(0);
                history.push('/dashboard');
            })
            .catch(()=>{
                toast.error('Erro ao atualizado o chamado!');
            })

            return;
        }

        await firebase.firestore().collection('chamados')
        .add({
            create: new Date(),
            cliente: cliente[clienteSelecionado].nomeFantasia,
            clienteId: cliente[clienteSelecionado].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid,
            excluido: false
        }).then(()=> {
            toast.success('Chamado criado com sucesso!');
            setComplemento('');
            setAssunto('Suporte');
            setStatus('Aberto');
            setClienteSelecionado(0);
        })
        .catch(()=>{
            toast.error('Ocorreu um erro na gravação do chamado');
        })
        // console.log(setAssunto);
    }

    //chamado quando troca o assunto
    function onChangeAssunto(e){
        setAssunto(e.target.value);
    }

    function onChangeStatus(e){
        setStatus(e.target.value);
    }

    function onChangeCliente(e){
        setClienteSelecionado(e.target.value);
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name='Novo chamado'>
                    <FiPlusCircle size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={gravarChamado}>
                        <label>Cliente</label>

                        {carregarDDLClientes ? (
                            <input type='text' disabled={true} value='Carregando...'/>
                        ) : (
                            <select value={clienteSelecionado} onChange={onChangeCliente}>
                                {cliente.map((item, index) => {
                                    return(
                                        <option key={item.id} value={index}>{item.nomeFantasia}</option>
                                    )
                                })}
                            </select>
                        )}

                        

                        <label>Assunto</label>
                        {/* <select value={assunto} onChange={(e) => {setAssunto(e.target.value)}}> */}
                        <select value={assunto} onChange={onChangeAssunto}>
                            <option value='Suporte'>Suporte</option>
                            <option value='Visita Tecnica'>Visita Tecnica</option>
                            <option value='Financeiro'>Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div>
                            <input type='radio' name='radio' value='Aberto' onChange={onChangeStatus} checked={status === 'Aberto'}/> <span>Em Aberto</span>
                            <input type='radio' name='radio' value='Andamento' onChange={onChangeStatus} checked={status === 'Andamento'}/> <span>Em Andamento</span>
                            <input type='radio' name='radio' value='Concluido' onChange={onChangeStatus} checked={status === 'Concluido'}/> <span>Concluido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea type='text' placeholder="Descreva seu problema (opcional)" value={complemento} onChange={(e) => setComplemento(e.target.value)}/>

                        <button type="submit">Salvar</button>
                    </form>
                </div>

            </div>
        </div>
    )
}