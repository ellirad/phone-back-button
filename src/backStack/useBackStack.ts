import { useCallback, useEffect, useState } from 'react'
import type { BackStackStep } from './backStack.types'
import { pushStep, popStep } from './stackReducer'
import { pushHistory, readHistory } from './historyAdapter'
import { readStackFromURL, writeStackToURL } from './stackSerializer'

export function useBackStack() {
    const [stack, setStack] = useState<BackStackStep[]>(() => {
        const fromHistory = readHistory()
        if (fromHistory.length) return fromHistory
        return readStackFromURL()
    })

    const push = useCallback((step: BackStackStep) => {
        setStack(prev => {
            const next = pushStep(prev, step)
            pushHistory(next)
            writeStackToURL(next)
            return next
        })
    }, [])

    const pop = useCallback(() => {
        setStack(prev => {
            if (prev.length === 0) return prev
            const next = popStep(prev)
            pushHistory(next)
            writeStackToURL(next)
            return next
        })
    }, [])

    const hasStep = useCallback(
        (step: BackStackStep) => stack.includes(step),
        [stack]
    )

    useEffect(() => {
        const onPopState = (event: PopStateEvent) => {
            const nextStack =
                event.state?.backStack ?? readStackFromURL()

            setStack(nextStack)
        }

        window.addEventListener('popstate', onPopState)
        return () => window.removeEventListener('popstate', onPopState)
    }, [])

    return {
        stack,
        push,
        pop,
        hasStep,
    }
}
