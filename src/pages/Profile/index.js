import { useState, useContext } from 'react';
import './profile.css';
import Header from '../../components/Header';
import Title from '../../components/Title';
import avatar from '../../assets/avatar.png';
import { FiSettings, FiUpload } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';


export default function Profile(){

    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [nome, setNome] = useState(user && user.nome);
    const [email, setEmail] = useState(user && user.email);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imagemAvatar, setImagemAvatar] = useState(null);


    

    async function previaImagem(e){
        if (e.target.files[0]){
            const imagem = e.target.files[0];

            if(imagem.type === 'image/jpeg' || imagem.type === 'image/png'){
                setImagemAvatar(imagem);
                setAvatarUrl(URL.createObjectURL(e.target.files[0]));
            }else{
                toast.warn('Envie uma imagem do tipo PNG ou JPEG');
                setImagemAvatar(null);
                return null;
            }
        }
    }

    //salvar sómente o nome
    async function salvar(e){
        e.preventDefault();

        if(imagemAvatar == null && nome !== ''){
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                nome: nome
            }).then(()=>{
                let data={
                    ...user,
                    nome: nome
                };
                setUser(data);
                storageUser(data);
                toast.success('Salvo com sucesso!');
            })
        }else if(imagemAvatar !== null && nome !== ''){
            uploadImagem();
        }
    }

    //salvar a imagem
    async function uploadImagem(){
        const uid = user.uid;
        // console.log(imagemAvatar);
        const upload = await firebase.storage()
        .ref(`images/${uid}/${imagemAvatar.name}`)
        .put(imagemAvatar)
        .then(async () =>{
            await firebase.storage()
            .ref(`images/${uid}`)
            .child(imagemAvatar.name)
            .getDownloadURL()
            .then(async (url)=>{
                let urlFoto = url;

                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: urlFoto,
                    nome: nome
                })
                .then(()=>{
                    let data = {
                        ...user,
                        avatarUrl: urlFoto,
                        nome: nome
                    };
                    setUser(data);
                    storageUser(data);
                    toast.success('Salvo com sucesso!');
                })
                .catch(()=>{
                    toast.warn('Ocorreu um problema!');
                })
            })
            .catch(()=>{
                toast.warn('Ocorreu um erro!2');
            })
        }).catch(()=>{
            toast.warn('Ocorreu um erro!1');
        })
    }

    return(
        <div>
            <Header/>

            <div className='content'>
                <Title name='Meu perfil'>
                    <FiSettings size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={salvar}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#FFF' size={25} />
                            </span>

                            <input type='file' accept='image/*' onChange={previaImagem}/> <br/>
                            { avatarUrl === null ? 
                            <img src={avatar} width='250' height='250' alt='Foto perfil' />
                            :
                            <img src={avatarUrl} width='250' height='250' alt='Foto perfil' />
                            }
                        </label>

                        <label>Nome</label>
                        <input type='text' value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>Email</label>
                        <input type='text' value={email} disabled={true} />

                        <button type='submit'>Salvar</button>
                    </form>
                </div>

                <div className='container'>
                    <button className='logout-btn' onClick={() => signOut()}>Sair</button>
                </div>

            </div>
        </div>
    )
}