import { useState, useRef, useEffect } from "react";
import { IMaskInput } from "react-imask"
import s from "./DateRangeSelect.module.scss";
import Arrow from '~/assets/icons/arrow.svg?react'
import CalendarIcon from '~/assets/icons/calendar.svg?react'

const options = [
    { label: "3 дня", value: "3d" },
    { label: "Неделя", value: "7d" },
    { label: "Месяц", value: "1m" },
    { label: "Год", value: "1y" },
];

export function DateRangeSelect({ onChange }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("3d");
    const [customRange, setCustomRange] = useState({ start: "", end: "" });

    const ref = useRef(null);

    const handleSelect = (val) => {
        setSelected(val);
        setOpen(false);

        if (val !== "custom") {
            onChange(getRange(val));
            setCustomRange({})
        }
    };

    const handleCustomChange = (dates) => {
        setCustomRange(dates);
        onChange(dates);
        setOpen(false)
        setSelected('custom')
    };

    const handleLeftArrow = () => {
        const index = options.findIndex((o) => o.value === selected)
        if (Number.isInteger(index)) {
            if (index - 1 >= 0) {
                handleSelect(options[index - 1].value)
            } else {
                handleSelect(options[options.length - 1].value)
            }
        }
    }

    const handleRightArrow = () => {
        const index = options.findIndex((o) => o.value === selected)
        if (Number.isInteger(index)) {
            if (index + 1 < options.length) {
                handleSelect(options[index + 1].value)
            } else handleSelect(options[0].value)
        }
    }

    const currentLabel = customRange.start && customRange.end ?
        `${customRange.start} — ${customRange.end}`
        :
        options.find((o) => o.value === selected)?.label || "Выберите дату";

    return (
        <div
            className={s.DateRangeSelect}
            ref={ref}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div className={s.selectButtons}>
                <Arrow className={s.arrowLeft} onClick={handleLeftArrow} />
                <div className={s.selectButton}>
                    <CalendarIcon className={open ? s.iconOpen : s.icon} />
                    <div className={s.dateRangeText}>{currentLabel}</div>
                </div>
                <Arrow className={s.arrowRight} onClick={handleRightArrow} />
            </div>

            <div className={open ? s.optionsActive : s.options}>
                {options.map((opt) => (
                    <div
                        key={opt.value}
                        className={opt.value === selected ? s.optionActive : s.option}
                        onClick={() => handleSelect(opt.value)}
                    >
                        {opt.label}
                    </div>
                ))}
                <div className={s.customDate}>
                    <div className={s.customDateLabel}>Указать даты</div>
                    <div className={s.dateInputContainer}>
                        <DateRangeCustom onChange={handleCustomChange} />
                        <CalendarIcon className={s.icon} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function getRange(preset) {
    const today = new Date();
    let start = new Date();

    switch (preset) {
        case "3d":
            start.setDate(today.getDate() - 3);
            break;
        case "7d":
            start.setDate(today.getDate() - 7);
            break;
        case "1m":
            start.setMonth(today.getMonth() - 1);
            break;
        case "1y":
            start.setFullYear(today.getFullYear() - 1);
            break;
        default:
            break;
    }
    const format = (d) => d.toISOString().slice(0, 10);

    return { start: format(start), end: format(today) };
}

export function DateRangeCustom({ onChange }) {
    const [value, setValue] = useState("__.__.__-___.__.__")

    const handleAccept = (val) => {
        const [start, end] = val.split("-")
        if (!start || !end) return

        const cleanStart = start.replace(/_/g, "").trim()
        const cleanEnd = end.replace(/_/g, "").trim()

        if (cleanStart.length < 8 || cleanEnd.length < 8) return

        onChange?.({
            start: `${cleanStart.slice(0, 2)}-${cleanStart.slice(3, 5)}-20${cleanStart.slice(6, 8)}`,
            end: `${cleanEnd.slice(0, 2)}-${cleanEnd.slice(3, 5)}-20${cleanEnd.slice(6, 8)}`
        })
        setValue("__.__.__-___.__.__")
    }

    return (
        <IMaskInput
            mask="DD.MM.YY-DD.MM.YY"
            lazy={false}
            placeholderChar="_"
            value={value}
            onAccept={handleAccept}
            blocks={{
                DD: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 31
                },
                MM: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12
                },
                YY: {
                    mask: IMask.MaskedRange,
                    from: 0,
                    to: 25
                },
            }}
            overwrite
            className={s.dateInput}
        />
    )
}