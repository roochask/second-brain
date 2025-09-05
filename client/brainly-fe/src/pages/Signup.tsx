import { useRef } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function signup() {
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;
        
      await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username,
            password: password
        }
      )
      navigate("/signin");
      alert("You have successfully signed up");
    }

    return(
        <div className="h-screen w-screen bg-gray-200
        flex justify-center items-center">
            <div className="flex justify-center bg-white rounded-xl  min-w-48 items-center p-8">
                <div>
                    <div className="flex justify-center">
                        Sign up 
                    </div>
                    <Input placeholder="Username" ref={usernameRef}/>
                    <Input placeholder="Password" ref={passwordRef}/>
                    <div className="flex justify-center pt-4">
                        <Button 
                            variant="primary" 
                            text="Sign up" 
                            fullWidth={true} 
                            loading={false}
                            onClick={signup}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}