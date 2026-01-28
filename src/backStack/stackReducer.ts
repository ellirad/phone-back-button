import type { BackStackStep } from './backStack.types'

export function pushStep(
    stack: BackStackStep[],
    step: BackStackStep
): BackStackStep[] {
    return [...stack, step]
}

export function popStep(
    stack: BackStackStep[]
): BackStackStep[] {
    return stack.slice(0, -1)
}
