import { useState, useRef, useEffect } from "react";
import "./Select.module.scss";
import { IconButton } from "../IconButton/IconButton";

export function Select({ options, onChange, label }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");



    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        setSelected(option.value);
        setOpen(false);
        onChange(option.value);
    };

    return (
        <div className="call-type-select" ref={ref}>
            <IconButton state={open} label={label} onClick={() => setOpen(!open)} />

            {open && (
                <div className="call-type-select__menu">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            className={`call-type-select__item ${selected === opt.value ? "active" : ""
                                }`}
                            onClick={() => handleSelect(opt)}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}