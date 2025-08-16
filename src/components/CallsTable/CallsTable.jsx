import React, { useState, useEffect } from "react";
import { getCalls, getCallRecord } from "~/lib/api/skillaApi";
import { ratingConfig } from "~/lib/consts/ratingConfig";
import { RatingCard } from "~/components/RatingCard/RatingCard";
import { IconButton } from "~/lib/ui/IconButton/IconButton";
import { CallStatusIcon } from "../CallStatusIcon/CallStatusIcon";
import { DateRangeSelect } from "~/lib/ui/DateRangeSelect/DateRangeSelect";
import { Select } from "~/lib/ui/Select/Select";
import { options } from "~/lib/consts/inOutConfig";

export function CallAudio({ recordId, partnershipId }) {
    const [audioUrl, setAudioUrl] = useState(null);

    useEffect(() => {
        getCallRecord(recordId, partnershipId)
            .then(blob => {
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
            })
            .catch(err => console.error("Ошибка загрузки аудио:", err));

        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [recordId, partnershipId]);

    if (!audioUrl) return null;

    return <audio controls src={audioUrl} />;
}

export const CallsTable = () => {

    const today = new Date()
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);

    const [calls, setCalls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dateStart, setDateStart] = useState(formatYMD(threeDaysAgo));
    const [dateEnd, setDateEnd] = useState(formatYMD(today));
    const [inOut, setInOut] = useState(""); // "" - все, 1 - входящие, 0 - исходящие

    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("DESC");

    function formatYMD(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }


    useEffect(() => {
        loadCalls();
    }, [dateStart, dateEnd, inOut, sortBy, order]);

    const loadCalls = async () => {
        setIsLoading(true);
        try {
            const data = await getCalls({
                date_start: dateStart,
                date_end: dateEnd,
                in_out: inOut,
                sort_by: sortBy,
                order: order,
                // limit: 50
            });

            const withRatings = data.results.map(c => {

                return ({
                    ...c,
                    rating: ratingConfig[c.time > 0 ? Math.round(Math.random() * 4) : 4],
                })
            });

            console.log(withRatings);

            setCalls(withRatings)

        } catch (e) {
            console.error(e)
        }
        setIsLoading(false);
    }

    const onChangeFilter = (sortParam) => {
        setOrder(prev => {
            let order = 'DESC';
            if (sortParam === sortBy) {
                prev === order ? order = 'ASC' : prev
            }
            return order
        })
        setSortBy(sortParam)
    }

    const formatTime = (seconds) => {
        if (!seconds) return ''
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts = [];
        if (hrs > 0) parts.push(String(hrs).padStart(2, '0'));
        parts.push(String(mins).padStart(2, '0'));
        parts.push(String(secs).padStart(2, '0'));

        return parts.join(':');
    }

    const changeDates = (dates) => {
        setDateStart(dates.start)
        setDateEnd(dates.end)
    }

    const onChangeInOut = (value) => {
        setInOut(value)
    }
    const inOutLabel = inOut === '' ?
        'Все типы' : inOut == 1 ?
            'Входящие' : 'Исходящие'

    const rows = isLoading ? Array.from({ length: 20 }) : calls;

    function isYesterday(date) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        return date.getFullYear() === yesterday.getFullYear() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getDate() === yesterday.getDate();
    }
    function isToday(date) {
        const today = new Date();

        return date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
    }

    function format(date) {
        return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    }

    const groupCallsByDate = (calls) => {
        const groups = {};
        calls.forEach(call => {
            const dateKey = call.date.slice(0, 10); // YYYY-MM-DD
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(call);
        });
        return groups;
    }

    const groupedCalls = groupCallsByDate(calls);

    // Получаем массив дат в порядке сортировки
    const sortedDates = Object.keys(groupedCalls).sort((a, b) => new Date(b) - new Date(a));


    return (
        <div>
            <div>
                <Select options={options} onChange={onChangeInOut} label={inOutLabel} />
                {inOut && <IconButton label={'Очистить фильтры'} onClick={() => setInOut('')} />}
                <DateRangeSelect onChange={changeDates} />
            </div>

            {/* Таблица */}

            <table border="1" cellPadding="5">
                <thead>
                    <tr>
                        <th>Тип</th>
                        <th><IconButton
                            label={'Время'}
                            onClick={() => onChangeFilter('date')}
                            state={sortBy === 'date' && order === 'ASC'}
                        /></th>
                        <th>Сотрудник</th>
                        <th>Номер</th>
                        <th>Источник</th>
                        <th>Оценка</th>
                        <th><IconButton
                            label={'Длительность'}
                            onClick={() => onChangeFilter('duration')}
                            state={sortBy === 'duration' && order === 'ASC'}
                        /></th>
                        <th>Запись</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedDates.map(dateKey => (
                        <React.Fragment key={dateKey}>
                            {isToday(new Date(dateKey)) ?
                                null
                                :
                                <tr>
                                    <td colSpan="8">
                                        <div>
                                            <div>{isYesterday(new Date(dateKey)) ? 'Вчера' : format(new Date(dateKey), 'dd.MM.yyyy')}</div>
                                            <div >{groupedCalls[dateKey].length}</div>
                                        </div>
                                    </td>
                                </tr>
                            }
                            {groupedCalls[dateKey].map(call => (
                                <tr key={call.id}>
                                    <td><CallStatusIcon status={call.status} in_out={call.in_out} /></td>
                                    <td>{new Date(call.date).toLocaleTimeString().slice(0, 5)}</td>
                                    <td><img src={call.person_avatar} /></td>
                                    <td>{call.from_number || call.to_number}</td>
                                    <td>{call.source || call.line_name || ""}</td>
                                    <td><RatingCard rating={call.rating} /></td>
                                    <td>{formatTime(call.time)}</td>
                                    <td>{call.record && call.partnership_id && <CallAudio recordId={call.record} partnershipId={call.partnership_id} />}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}