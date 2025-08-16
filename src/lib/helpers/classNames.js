export default function classNames(cls, mods = {}, additional = []) {
    return [cls,
        ...additional.filter(Boolean),
        ...Object.entries(mods)
            // eslint-disable-next-line no-unused-vars
            .filter(([_, value]) => Boolean(value))
            .map(([className]) => className),
    ]
        .join(' ')
}
