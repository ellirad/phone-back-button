import {createContext, type ReactNode} from 'react'

import { useBackStack } from './useBackStack'
import type { BackStackApi } from './backStack.types'

const BackStackContext = createContext<BackStackApi | null>(null)

export function BackStackProvider({ children }: { children: ReactNode }) {
    const backStack = useBackStack()

    return (
        <BackStackContext.Provider value={backStack}>
            {children}
        </BackStackContext.Provider>
    )
}
