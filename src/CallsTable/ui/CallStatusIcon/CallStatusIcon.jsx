import React, { useMemo } from 'react'
import IncomingCall from '~/assets/icons/incomingCall.svg?react'
import OutgoingCall from '~/assets/icons/outgoingCall.svg?react'
import MissedCall from '~/assets/icons/missedCall.svg?react'
import FailedCall from '~/assets/icons/unansweredCall.svg?react'

export const CallStatusIcon = ({ status, in_out }) => {

    const callType = useMemo(() => {
        if (status === "Дозвонился") {
            return in_out === 1 ? "incoming" : "outgoing";
        } else {
            return in_out === 1 ? "missed" : "failed";
        }
    }, [status, in_out]);

    switch (callType) {
        case "incoming":
            return <IncomingCall />
        case "outgoing":
            return <OutgoingCall />
        case "missed":
            return <MissedCall />
        case "failed":
            return <FailedCall />
        default:
            return null
    }
}

