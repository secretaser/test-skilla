import React from 'react'
import classNames from '~/lib/helpers/classNames'
import s from './Text.module.scss'

export const Text = ({ label, size, color, align, className }) => {
    return (
        <div className={classNames(s.Text, {}, [s[size], s[color], s[align], s[className]])}>
            {label}
        </div>
    )
}
