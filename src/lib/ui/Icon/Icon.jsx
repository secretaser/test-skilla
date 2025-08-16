import { memo } from "react"
import classNames from "../../helpers/classNames"

export const Icon = memo((props) => {
    const {
        className,
        Svg,
    } = props

    return (
        <Svg className={classNames(s.Icon, {}, [className])} />
    )
})