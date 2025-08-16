import classNames from '../../helpers/classNames'
import Arrow from '~/assets/icons/arrowDown.svg?react'
import s from './IconButton.module.scss'
import { Text } from '../Text/Text'

export const IconButton = (props) => {
    const {
        label,
        state,
        onClick,
        size,
        color,
        Icon
    } = props

    const mods = {
        [s.pressed]: state
    }
    return (
        <div onClick={onClick} className={classNames(s.IconButton, mods, [])} >
            <Text label={label} size={size} color={color} />
            {Icon ?
                <Icon className={classNames(s.icon, {}, [])} />
                :
                <Arrow className={classNames(s.icon, {}, [])} />
            }

        </div>
    )
}

