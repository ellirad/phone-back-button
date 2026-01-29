import type { BackStackStep } from './backStack.types'

const STATE_KEY = 'backStack'

export function pushHistory(stack: BackStackStep[]) {
    history.pushState({ [STATE_KEY]: stack }, '')
}
