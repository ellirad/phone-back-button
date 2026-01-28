export type BackStackStep = string

export interface BackStackApi {
    stack: BackStackStep[]
    push: (step: BackStackStep) => void
    pop: () => void
    hasStep: (step: BackStackStep) => boolean
}
