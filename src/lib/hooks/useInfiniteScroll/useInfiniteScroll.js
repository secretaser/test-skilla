import { useEffect } from 'react'

export const useInfiniteScroll = ({
    callback, triggerRef, isLoading = false,
}) => {
    useEffect(() => {
        const triggerElement = triggerRef.current
        let observer = null
        if (callback) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 1.0,
            }

            observer = new IntersectionObserver(([entry]) => {
                if (!isLoading && entry.isIntersecting) {
                    callback()
                }
            }, options)

            observer.observe(triggerElement)
        }
        return () => {
            if (observer && triggerElement) {
                observer.unobserve(triggerElement)
            }
        }
    }, [callback, isLoading, triggerRef])
}