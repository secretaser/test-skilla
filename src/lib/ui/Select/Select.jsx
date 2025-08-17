import { useState, useRef, useEffect } from "react";
import s from "./Select.module.scss";
import { IconButton } from "../IconButton/IconButton";
import { Text } from "../Text/Text";

export function Select({ options, onChange, label, selected }) {
    const [open, setOpen] = useState(false);

    const handleSelect = (option) => {
        setOpen(false);
        onChange(option.value);
    };

    return (
        <div
            className={s.Select}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <IconButton
                state={open}
                size={'s'}
                label={label}
                color={label === 'Все типы' ? 'secondary' : 'active'}
            />
            <div
                className={open ? s.optionsActive : s.options}
            >
                {options.map((opt) => (
                    <div
                        // className={s.option}
                        className={opt.value === selected ? s.optionActive : s.option}
                        onClick={() => handleSelect(opt)}
                    >
                        <Text key={opt.value} label={opt.label} size={'xs'} />
                    </div>
                ))}
            </div>
        </div>
    );
}