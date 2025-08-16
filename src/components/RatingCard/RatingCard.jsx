import s from './RatingCard.module.scss'
import classNames from '~/lib/helpers/classNames'

export const RatingCard = ({ rating }) => {

    return (
        <div className={classNames(s.RatingCard, {}, [s[rating.className]])}>
            {rating.label}
        </div>
    )
}
