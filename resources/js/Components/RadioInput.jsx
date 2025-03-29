import { Children } from "react";
import InputLabel from "./InputLabel";
import TextInput from "./TextInput";

export default function RadioInput({ onChange = () => {}, name, htmlFor, label, labelClass = null, value, ...props }) {
    return (
        <div className="flex justify-between items-center">
            <InputLabel htmlFor={htmlFor} value={label} className={labelClass} />
            <TextInput id={htmlFor} type="radio" name={name} className="p-3 mx-2" onChange={onChange} value={value} {...props} />
        </div>
    )
}
