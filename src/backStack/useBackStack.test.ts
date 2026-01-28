import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useBackStack } from './useBackStack'

describe('useBackStack', () => {
    beforeEach(() => {
        // Clear URL and history before each test
        window.history.replaceState(null, '', '/')
        
        // Mock URL search params
        delete (window as any).location
        window.location = {
            search: '',
            pathname: '/',
            href: 'http://localhost/',
        } as any
    })

    describe('push function', () => {
        it('correctly adds a new step to the stack', () => {
            const { result } = renderHook(() => useBackStack())

            expect(result.current.stack).toEqual([])

            act(() => {
                result.current.push('step1')
            })

            expect(result.current.stack).toEqual(['step1'])

            act(() => {
                result.current.push('step2')
            })

            expect(result.current.stack).toEqual(['step1', 'step2'])
        })

        it('updates browser history when pushing a step', () => {
            const { result } = renderHook(() => useBackStack())

            act(() => {
                result.current.push('step1')
            })

            expect(window.history.state?.backStack).toEqual(['step1'])
        })
    })

    describe('pop function', () => {
        it('correctly removes the last step from the stack', () => {
            const { result } = renderHook(() => useBackStack())

            act(() => {
                result.current.push('step1')
                result.current.push('step2')
                result.current.push('step3')
            })

            expect(result.current.stack).toEqual(['step1', 'step2', 'step3'])

            act(() => {
                result.current.pop()
            })

            expect(result.current.stack).toEqual(['step1', 'step2'])

            act(() => {
                result.current.pop()
            })

            expect(result.current.stack).toEqual(['step1'])
        })

        it('does nothing when the stack is empty', () => {
            const { result } = renderHook(() => useBackStack())

            expect(result.current.stack).toEqual([])

            act(() => {
                result.current.pop()
            })

            expect(result.current.stack).toEqual([])

            // Try multiple pops on empty stack
            act(() => {
                result.current.pop()
                result.current.pop()
            })

            expect(result.current.stack).toEqual([])
        })

        it('updates browser history when popping a step', () => {
            const { result } = renderHook(() => useBackStack())

            act(() => {
                result.current.push('step1')
                result.current.push('step2')
            })

            expect(window.history.state?.backStack).toEqual(['step1', 'step2'])

            act(() => {
                result.current.pop()
            })

            expect(window.history.state?.backStack).toEqual(['step1'])
        })
    })

    describe('hasStep function', () => {
        it('accurately reflects the presence of a step in the stack', () => {
            const { result } = renderHook(() => useBackStack())

            expect(result.current.hasStep('step1')).toBe(false)
            expect(result.current.hasStep('step2')).toBe(false)

            act(() => {
                result.current.push('step1')
            })

            expect(result.current.hasStep('step1')).toBe(true)
            expect(result.current.hasStep('step2')).toBe(false)

            act(() => {
                result.current.push('step2')
            })

            expect(result.current.hasStep('step1')).toBe(true)
            expect(result.current.hasStep('step2')).toBe(true)
            expect(result.current.hasStep('step3')).toBe(false)

            act(() => {
                result.current.pop()
            })

            expect(result.current.hasStep('step1')).toBe(true)
            expect(result.current.hasStep('step2')).toBe(false)
        })
    })

    describe('URL and browser history synchronization', () => {
        it('correctly synchronizes the stack with the URL on push', () => {
            const { result } = renderHook(() => useBackStack())
            const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

            act(() => {
                result.current.push('step1')
            })

            // Check that replaceState was called with the correct URL
            expect(replaceStateSpy).toHaveBeenCalledWith(
                expect.anything(),
                '',
                '?step=step1'
            )

            act(() => {
                result.current.push('step2')
            })

            expect(replaceStateSpy).toHaveBeenCalledWith(
                expect.anything(),
                '',
                '?step=step1%2Cstep2'
            )

            replaceStateSpy.mockRestore()
        })

        it('correctly synchronizes the stack with the URL on pop', () => {
            const { result } = renderHook(() => useBackStack())
            const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

            act(() => {
                result.current.push('step1')
                result.current.push('step2')
            })

            act(() => {
                result.current.pop()
            })

            // Check that replaceState was called with the correct URL
            expect(replaceStateSpy).toHaveBeenCalledWith(
                expect.anything(),
                '',
                '?step=step1'
            )

            act(() => {
                result.current.pop()
            })

            // When stack is empty, URL should be cleared (pathname only)
            expect(replaceStateSpy).toHaveBeenCalledWith(
                expect.anything(),
                '',
                '/'
            )

            replaceStateSpy.mockRestore()
        })

        it('correctly synchronizes the stack with browser history on state changes', async () => {
            const { result } = renderHook(() => useBackStack())

            act(() => {
                result.current.push('step1')
                result.current.push('step2')
            })

            expect(result.current.stack).toEqual(['step1', 'step2'])

            // Simulate browser back button by triggering popstate event
            act(() => {
                window.history.pushState({ backStack: ['step1'] }, '')
                window.dispatchEvent(new PopStateEvent('popstate', {
                    state: { backStack: ['step1'] }
                }))
            })

            await waitFor(() => {
                expect(result.current.stack).toEqual(['step1'])
            })
        })

        it('reads stack from URL on initialization when history is empty', () => {
            // Set URL params before rendering hook
            window.history.replaceState(null, '', '?step=step1,step2')
            window.location.search = '?step=step1,step2'

            const { result } = renderHook(() => useBackStack())

            expect(result.current.stack).toEqual(['step1', 'step2'])
        })

        it('reads stack from history state on initialization when available', () => {
            // Set history state before rendering hook
            window.history.replaceState({ backStack: ['stepA', 'stepB'] }, '', '/')

            const { result } = renderHook(() => useBackStack())

            expect(result.current.stack).toEqual(['stepA', 'stepB'])
        })

        it('handles popstate event with no state by reading from URL', async () => {
            const { result } = renderHook(() => useBackStack())

            act(() => {
                result.current.push('step1')
            })

            // Simulate popstate with no state
            act(() => {
                window.history.replaceState(null, '', '?step=step2,step3')
                window.location.search = '?step=step2,step3'
                window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
            })

            await waitFor(() => {
                expect(result.current.stack).toEqual(['step2', 'step3'])
            })
        })
    })
})
