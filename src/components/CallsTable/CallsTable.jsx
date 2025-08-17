import React, { useState, useEffect, useRef, useCallback } from "react";
import { getCalls } from "~/lib/api/skillaApi";
import { ratingConfig } from "~/lib/consts/ratingConfig";
import { RatingCard } from "~/components/RatingCard/RatingCard";
import { IconButton } from "~/lib/ui/IconButton/IconButton";
import { CallStatusIcon } from "../CallStatusIcon/CallStatusIcon";
import CrossIcon from '~/assets/icons/cross.svg?react';
import { DateRangeSelect } from "~/lib/ui/DateRangeSelect/DateRangeSelect";
import { Select } from "~/lib/ui/Select/Select";
import { options } from "~/lib/consts/inOutConfig";
import { useInfiniteScroll } from "../../lib/hooks/useInfiniteScroll/useInfiniteScroll";
import { Text } from "../../lib/ui/Text/Text";
import s from './CallsTable.module.scss'
import classNames from "../../lib/helpers/classNames";
import { CallAudio } from "../CallAudio/CallAudio";

export const CallsTable = () => {

    const today = new Date()
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 2);

    const [calls, setCalls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [dateStart, setDateStart] = useState(formatYMD(threeDaysAgo));
    const [dateEnd, setDateEnd] = useState(formatYMD(today));
    const [inOut, setInOut] = useState(""); // "" - все, 1 - входящие, 0 - исходящие

    const [sortBy, setSortBy] = useState("date");
    const [order, setOrder] = useState("DESC");

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const triggerRef = useRef()

    const onScrollEnd = useCallback(() => {
        if (!isLoading && hasMore) {
            setOffset(prev => prev + 50);
        }
    }, [isLoading, hasMore]);

    useInfiniteScroll({
        callback: onScrollEnd,
        triggerRef,
        isLoading,
    })

    useEffect(() => {
        setOffset(0);
        setCalls([]);
        setHasMore(true);
    }, [dateStart, dateEnd, inOut, sortBy, order]);

    useEffect(() => {
        if (hasMore) loadCalls();
    }, [offset, dateStart, dateEnd, inOut, sortBy, order]);

    const loadCalls = async () => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);

        try {
            const data = await getCalls({
                date_start: dateStart,
                date_end: dateEnd,
                in_out: inOut,
                sort_by: sortBy,
                order: order,
                offset, // используем offset вместо page
            });

            const withRatings = data.results.map(c => ({
                ...c,
                rating: ratingConfig[c.time > 0 ? Math.round(Math.random() * 4) : 4],
            }));

            setCalls(prev => [...prev, ...withRatings]);
            if (!data.results.length) setHasMore(false);
        } catch (e) {
            console.error(e);
        }

        setIsLoading(false);
    };

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

    function formatYMD(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
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
        return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear() % 100}`;
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

    const sortedDates = order === 'DESC' ? Object.keys(groupedCalls).sort((a, b) => new Date(b) - new Date(a))
        :
        Object.keys(groupedCalls).sort((a, b) => new Date(a) - new Date(b));


    return (
        <div className={s.CallsTable}>
            <div className={s.wrapper}>
                <div className={s.filters}>
                    <div className={s.inOutFilters}>
                        <Select options={options} onChange={onChangeInOut} label={inOutLabel} />
                        {inOut && <IconButton
                            label={'Очистить фильтры'}
                            onClick={() => setInOut('')}
                            Icon={CrossIcon}
                            color={'secondary'}
                        />}
                    </div>
                    <DateRangeSelect onChange={changeDates} />
                </div>

                {/* Таблица */}

                <table className={s.table}>
                    <thead className={s.thead}>
                        <tr className={s.headerRow}>
                            <th className={classNames(s.headerTh, {}, [s.typeHeader])}><Text color={'secondary'} size={'s'} label={'Тип'} /></th>
                            <th className={classNames(s.headerTh, {}, [s.dateHeader])}>
                                <IconButton color={'secondary'}
                                    label={'Время'}
                                    onClick={() => onChangeFilter('date')}
                                    state={sortBy === 'date' && order === 'ASC'}
                                />
                            </th>
                            <th className={classNames(s.headerTh, {}, [s.empHeader])}><Text color={'secondary'} size={'s'} label={'Сотрудник'} /></th>
                            <th className={classNames(s.headerTh, {}, [s.numHeader])}><Text color={'secondary'} size={'s'} label={'Звонок'} /></th>
                            <th className={classNames(s.headerTh, {}, [s.srcHeader])}><Text color={'secondary'} size={'s'} label={'Источник'} /></th>
                            <th className={classNames(s.headerTh, {}, [s.rateHeader])}><Text color={'secondary'} size={'s'} label={'Оценка'} /></th>
                            <th className={classNames(s.headerTh, {}, [s.durationHeader])}><IconButton color={'secondary'}
                                label={'Длительность'}
                                onClick={() => onChangeFilter('duration')}
                                state={sortBy === 'duration' && order === 'ASC'}
                            /></th>
                        </tr>
                    </thead>
                    <tbody className={s.tbody}>
                        {sortedDates.map(dateKey => (
                            <React.Fragment key={dateKey}>
                                {isToday(new Date(dateKey)) ?
                                    null
                                    :
                                    <tr>
                                        <td className={s.dayCountTd}>
                                            <div className={s.dayCount}>
                                                <Text color={'main'} size={'m'} label={isYesterday(new Date(dateKey)) ? 'Вчера' : format(new Date(dateKey))} />
                                                <div className={s.count}><Text label={groupedCalls[dateKey].length} size={'xs'} color={'secondary'} /></div>
                                            </div>
                                        </td>
                                    </tr>
                                }
                                {groupedCalls[dateKey].map(call => (
                                    <tr
                                        key={call.id}
                                        className={s.row}
                                    >
                                        <td className={s.callStatusTd}><CallStatusIcon status={call.status} in_out={call.in_out} /></td>
                                        <td><Text label={new Date(call.date).toLocaleTimeString().slice(0, 5)} color={'main'} size={'m'} /></td>
                                        <td><img src={call.person_avatar} className={s.img} /></td>
                                        <td>
                                            <Text label={call.from_number || call.to_number} color={'main'} size={'m'} />
                                        </td>
                                        <td>
                                            <Text color={'secondary'} size={'m'} label={call.source || call.line_name || ""} />
                                        </td>
                                        <td><RatingCard rating={call.rating} /></td>
                                        <td className={s.recordTd}>
                                            <Text label={formatTime(call.time)} color={'main'} size={'m'} align={'right'} />
                                            {call.record && call.partnership_id && <CallAudio recordId={call.record} partnershipId={call.partnership_id} className={s.audio} />}
                                        </td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                        {isLoading && (
                            <tr>
                                <td colSpan="8" className={s.loading}><Text label={'Загрузка...'} size={'l'} align={'center'} color={'secondary'} /></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {onScrollEnd && <div ref={triggerRef} style={{ width: '100px', height: '1px' }} />}
            </div>
        </div>
    );
}