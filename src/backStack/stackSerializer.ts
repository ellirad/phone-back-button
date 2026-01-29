import type { BackStackStep } from './backStack.types'

const PARAM = 'step'

export function encodeStack(stack: BackStackStep[]): string {
    if (stack.length === 0) return ''
    return stack.join(',')
}

export function writeStackToURL(stack: BackStackStep[]) {
    const params = new URLSearchParams(window.location.search)

    if (stack.length === 0) {
        params.delete(PARAM)
    } else {
        params.set(PARAM, encodeStack(stack))
    }

    const query = params.toString()
    const url = query ? `?${query}` : window.location.pathname

    history.replaceState(history.state, '', url)
}
