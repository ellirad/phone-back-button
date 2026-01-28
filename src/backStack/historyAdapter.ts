import type { BackStackStep } from './backStack.types'

const STATE_KEY = 'backStack'

export function pushHistory(stack: BackStackStep[]) {
    history.pushState({ [STATE_KEY]: stack }, '')
}

export function readHistory(): BackStackStep[] {
    return history.state?.[STATE_KEY] ?? []
}
