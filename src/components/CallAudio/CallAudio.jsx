import { useEffect, useState } from 'react';
import { getCallRecord } from '~/lib/api/skillaApi.js'

export const CallAudio = ({ recordId, partnershipId, className }) => {
    const [audioUrl, setAudioUrl] = useState(null);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (clicked) {
            getCallRecord(recordId, partnershipId)
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    setAudioUrl(url);
                })
                .catch(err => console.error("Ошибка загрузки аудио:", err));
        }
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [recordId, partnershipId, clicked]);

    const load = () => {

        if (!clicked) setClicked(true)
    }
    if (!recordId || !partnershipId) return null;

    return <audio
        controls
        src={audioUrl}
        className={className}
        onMouseEnter={load}
    />;
}