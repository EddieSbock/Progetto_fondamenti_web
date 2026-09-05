import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Contesto } from "../contesto/AuthContext";
import { useContext } from "react";

export function ProtezioneRotte() {

    const { token }= useContext(Contesto)

    if(!token){
        return <Navigate to="/login" replace/>
    } else {
        return <Outlet />;
    }
}