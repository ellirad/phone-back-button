import { useCallback, useEffect, useState } from 'react'

import type { BackStackStep } from './backStack.types'
import { writeStackToURL } from './stackSerializer'
import { pushStep, popStep } from './stackReducer'
import { pushHistory } from './historyAdapter'

export function useBackStack() {
    const [stack, setStack] = useState<BackStackStep[]>([])

    const push = useCallback((step: BackStackStep) => {
        setStack(prev => {
            const next = pushStep(prev, step)
    
            if (prev.length === 0 && next.length === 1) {
                pushHistory(next)
            }

            writeStackToURL(next)
            
            return next
        })
    }, [])

    const pop = useCallback(() => {
        setStack(prev => {
            if (prev.length === 0) return prev
            const next = popStep(prev)
            return next
        })
    }, [])

    const hasStep = useCallback(
        (step: BackStackStep) => stack.includes(step),
        [stack]
    )

    useEffect(() => {
        const onPopState = () => {
            setStack(currentStack => {
                
                if (currentStack.length > 0) {
                    const next = popStep(currentStack)
                    return next
                } else {
                    return currentStack
                }
            })
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
