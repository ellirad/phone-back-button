import { Sheet } from 'react-modal-sheet'

import { SheetA, SheetB } from '../src/bottomSheets'
import { WelcomePage } from '../src/pages/welcome'
import { useBackStack } from './backStack'

export default function App() {
    const { push, pop, hasStep } = useBackStack()

    return (
        <>
            <WelcomePage onOpenSheetA={() => push('A')} />

            <Sheet
                isOpen={hasStep('A')}
                onClose={pop}
                snapPoints={[0, 0.5]}
                initialSnap={1}
            >
                <Sheet.Container>
                    <Sheet.Content>
                        <SheetA onOpenSheetB={() => push('B')} />
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={pop} />
            </Sheet>

            <Sheet
                isOpen={hasStep('B')}
                onClose={pop}
                snapPoints={[0, 0.8]}
                initialSnap={1}
            >
                <Sheet.Container>
                    <Sheet.Content>
                        <SheetB />
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop onTap={pop} />
            </Sheet>
        </>
    )
}
