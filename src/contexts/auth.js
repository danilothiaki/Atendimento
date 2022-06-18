import { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import { toast } from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);



    useEffect(()=>{
        //localStorage do usuário
        function loadStorage(){
            const storageUser= localStorage.getItem('Usuario');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
    
            setLoading(false);
        }
        loadStorage();
        
    }, [])


        //função de cadastro de usuário
        async function signUp(nome, email, senha){
            
            
            setLoadingAuth(true);

            await firebase.auth().createUserWithEmailAndPassword(email, senha)
            .then( async(value)=>{
                let uid = value.user.uid;

                await firebase.firestore().collection('users')
                .doc(uid)
                .set({
                    nome: nome,
                    avatarUrl: null,
                })
                .then(()=> {
                    let data = {
                        uid: uid,
                        nome: nome,
                        email: value.user.email,
                        avatarUrl: null
                    };
                    setUser(data);
                    storageUser(data);
                    setLoadingAuth(false);
                    toast.success('Bem vindo!');
                }

                )
                .catch(()=>{
                    // alert('erro signUp firebase.firestore().collection auth.js');
                    setLoadingAuth(false);
                    toast.success('Erro ao fazer o cadastro!');
                })
            })
            .catch((error)=>{
                // alert('erro signUp firebase.auth().createUserWithEmailAndPassword auth.js');
                setLoadingAuth(false);
                toast.success('Erro ao fazer o cadastro!');
            })
        }

        function storageUser(data){
            localStorage.setItem('Usuario', JSON.stringify(data));
        }

        //função de logar o usuário
        async function signIn(email, senha){
            setLoadingAuth(true);

            await firebase.auth().signInWithEmailAndPassword(email, senha)
            .then( async(value)=>{
                let uid = value.user.uid;

                // await firebase.firestore().collection('users')
                // .doc(uid)
                // .get()
                // .then((value)=> {
                //     let data = {
                //         uid: uid,
                //         nome: value.user.nome,
                //         email: value.user.email,
                //         avatarUrl: null
                //     };
                //     setUser(data);
                //     storageUsuario(data);
                //     setLoadingAuth(false);
                // }

                // )
                // .catch(()=>{
                //     alert('erro signIn firebase.firestore().collection auth.js');
                // })

                const usuario = await firebase.firestore().collection('users')
                .doc(uid)
                .get();
                
                let data = {
                    uid: uid,
                    nome: usuario.data().nome,
                    email: value.user.email,
                    avatarUrl: usuario.data().avatarUrl
                }

                    setUser(data);
                    storageUser(data);
                    setLoadingAuth(false);
                    toast.success('Bem vindo!');

            }).catch(()=>{
                alert('erro signIn firebase.auth().signInWithEmailAndPassword auth.js');
                setLoadingAuth(false);
                toast.success('Erro ao fazer o login!');
            })
        }

        //função de deslogar o usuário
        async function signOut(){
            localStorage.removeItem('Usuario');
            await firebase.auth().signOut();
            setUser(null);
        }


return(
    <AuthContext.Provider value={{
        signed: !!user, 
        user, 
        loading,
        signUp,
        signOut,
        signIn,
        loadingAuth,
        setUser,
        storageUser
        }}>
        {children}
    </AuthContext.Provider>
)

}

export default AuthProvider;