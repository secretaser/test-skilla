import classNames from '../../helpers/classNames'
import Arrow from '~/assets/icons/arrowDown.svg?react'
import s from './IconButton.module.scss'

export const IconButton = (props) => {
    const {
        label,
        state,
        onClick
    } = props

    const mods = {
        [s.pressed]: state
    }
    return (
        <div onClick={onClick} className={classNames(s.IconButton, mods, [])} >
            <div className={s.label}>{label}</div>
            <Arrow className={classNames(s.icon, {}, [])} />
        </div>
    )
}

