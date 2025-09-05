import { forwardRef, ChangeEvent } from 'react';

interface InputProps {
    placeholder: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ placeholder, value, onChange }, ref) => {
        return(
            <div>
                <input 
                    type="text" 
                    placeholder={placeholder} 
                    className="px-4 py-2 border rounded-md m-2" 
                    ref={ref}
                    value={value}
                    onChange={onChange}
                />
            </div>
        )
    }
)