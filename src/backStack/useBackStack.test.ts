import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
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

        it('updates browser history only on first push', () => {
            const { result } = renderHook(() => useBackStack())
            const pushStateSpy = vi.spyOn(window.history, 'pushState')

            // First push should create history entry
            act(() => {
                result.current.push('step1')
            })

            expect(pushStateSpy).toHaveBeenCalledTimes(1)
            expect(window.history.state?.backStack).toEqual(['step1'])

            // Second push should NOT create new history entry
            act(() => {
                result.current.push('step2')
            })

            expect(pushStateSpy).toHaveBeenCalledTimes(1) // Still only 1 call
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

        it('does not update browser history when popping a step', () => {
            const { result } = renderHook(() => useBackStack())
            const pushStateSpy = vi.spyOn(window.history, 'pushState')

            // Push some steps
            act(() => {
                result.current.push('step1')
                result.current.push('step2')
            })

            // Reset spy to count only pop operations
            pushStateSpy.mockClear()

            // Pop should not create new history entries
            act(() => {
                result.current.pop()
            })

            expect(pushStateSpy).not.toHaveBeenCalled()
            
            // State should still be updated locally
            expect(result.current.stack).toEqual(['step1'])
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

        it('does not update URL when popping steps', () => {
            const { result } = renderHook(() => useBackStack())
            const replaceStateSpy = vi.spyOn(window.history, 'replaceState')

            // Push steps to setup
            act(() => {
                result.current.push('step1')
                result.current.push('step2')
            })

            // Clear spy to only track pop operations
            replaceStateSpy.mockClear()

            act(() => {
                result.current.pop()
            })

            // URL should not be updated on pop to avoid history issues
            expect(replaceStateSpy).not.toHaveBeenCalled()

            replaceStateSpy.mockRestore()
        })

    })

    describe('popstate event handling', () => {
        it('closes top-most sheet when popstate fires and sheets are open', () => {
            const { result } = renderHook(() => useBackStack())

            // Setup: open some sheets
            act(() => {
                result.current.push('step1')
                result.current.push('step2')
            })

            expect(result.current.stack).toEqual(['step1', 'step2'])

            // Simulate browser back button by triggering popstate event
            act(() => {
                window.dispatchEvent(new PopStateEvent('popstate'))
            })

            // Should close the top-most sheet
            expect(result.current.stack).toEqual(['step1'])
        })

        it('closes all sheets one by one on repeated popstate events', () => {
            const { result } = renderHook(() => useBackStack())

            // Setup: open multiple sheets
            act(() => {
                result.current.push('step1')
                result.current.push('step2')
                result.current.push('step3')
            })

            expect(result.current.stack).toEqual(['step1', 'step2', 'step3'])

            // First popstate - close step3
            act(() => {
                window.dispatchEvent(new PopStateEvent('popstate'))
            })
            expect(result.current.stack).toEqual(['step1', 'step2'])

            // Second popstate - close step2
            act(() => {
                window.dispatchEvent(new PopStateEvent('popstate'))
            })
            expect(result.current.stack).toEqual(['step1'])

            // Third popstate - close step1
            act(() => {
                window.dispatchEvent(new PopStateEvent('popstate'))
            })
            expect(result.current.stack).toEqual([])
        })

        it('does nothing on popstate when no sheets are open', () => {
            const { result } = renderHook(() => useBackStack())

            expect(result.current.stack).toEqual([])

            // Trigger popstate with empty stack
            act(() => {
                window.dispatchEvent(new PopStateEvent('popstate'))
            })

            // Should remain empty
            expect(result.current.stack).toEqual([])
        })
    })
})
