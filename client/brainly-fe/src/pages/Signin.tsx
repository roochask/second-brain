import { useRef } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Signin() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function signin() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        const response = await axios.post<any>(`${BACKEND_URL}/api/v1/signin`, {
            username: username,
            password: password
        })

        const jwt = response.data.token;
        localStorage.setItem("token", jwt);
        //redirect the use to the dashboard
        navigate("/dashboard");
    }

    return(
        <div className="h-screen w-screen bg-gray-200
        flex justify-center items-center">
            <div className="flex justify-center bg-white rounded-xl  min-w-48 items-center p-8">
                <div>
                    <div className="flex justify-center">
                        Sign in
                    </div>
                    <Input placeholder="Username" ref={usernameRef}/>
                    <Input placeholder="Password" ref={passwordRef}/>
                    <div className="flex justify-center pt-4">
                        <Button 
                            variant="primary" 
                            text="Sign in" 
                            fullWidth={true} 
                            loading={false}
                            onClick={signin}    
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}