import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';


export default function RouteWrapper({
    component: Component,
    isPrivate, //rota privada, (que precisa de login)
    ...rest
}){

    const {signed, loading} = useContext(AuthContext);



    if(loading){
        return(
            <div></div>
        )
    }

    if(!signed && isPrivate){
        return <Redirect to='/' />
        //não está logado e é uma rota privada, retorna para página inicial
    }

    if(signed && !isPrivate){
        return <Redirect to='/dashboard' />
        //não está logado e é uma rota privada, retorna para página o dashboard
    }

    return(
        <Route
        {...rest}
        render={props => (
            <Component {...props} />
        )}
        />
    )
}