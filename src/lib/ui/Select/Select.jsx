import { useState, useRef, useEffect } from "react";
import s from "./Select.module.scss";
import { IconButton } from "../IconButton/IconButton";
import { Text } from "../Text/Text";

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
        <div className={s.Select} ref={ref}>
            <IconButton state={open} size={'s'} label={label} color={label === 'Все типы' ? 'secondary' : 'active'} onClick={() => setOpen(!open)} />

            {open && (
                <div
                    className={s.options}
                >
                    {options.map((opt) => (
                        <div
                            className={s.option}
                            onClick={() => handleSelect(opt)}
                        >
                            <Text key={opt.value} label={opt.label} size={'xs'} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}