import React from 'react'
import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react'
import { ITerminalAddon, ITerminalOptions, Terminal } from 'xterm'
import 'xterm/css/xterm.css'

interface IProps {
	className?: string
	options?: ITerminalOptions
	addons?: Array<ITerminalAddon>
	onBinary?(data: string): void
	onCursorMove?(): void
	onData?(data: string): void
	onKey?(event: { key: string; domEvent: KeyboardEvent }): void
	onLineFeed?(): void
	onScroll?(newPosition: number): void
	onSelectionChange?(): void
	onRender?(event: { start: number; end: number }): void
	onResize?(event: { cols: number; rows: number }): void
	onTitleChange?(newTitle: string): void
	customKeyEventHandler?(event: KeyboardEvent): boolean
}
const Xterm = forwardRef<Terminal, IProps>(
	(
		{
			className,
			options,
			addons,
			onBinary,
			onCursorMove,
			onData,
			onKey,
			onLineFeed,
			onScroll,
			onSelectionChange,
			onRender,
			onResize,
			onTitleChange,
			customKeyEventHandler,
		},
		ref
	) => {
		const terminalRef = useRef<HTMLDivElement>(null)
		const terminal = useRef<Terminal>(null!)
		useEffect(() => {
			const term = terminal.current!
			if (!term) return
			if (ref) typeof ref === 'function' ? ref(term) : (ref!.current = term)

			if (addons) {
				addons.forEach(addon => {
					term.loadAddon(addon)
				})
			}

			if (terminalRef.current) {
				term.open(terminalRef.current)
			}

			term.onBinary(onBinary ?? console.log)
			term.onCursorMove(onCursorMove ?? (() => {}))
			term.onData(onData ?? (() => () => {}))
			term.onKey(onKey ?? (() => {}))
			term.onLineFeed(onLineFeed ?? (() => {}))
			term.onScroll(onScroll ?? (() => {}))
			term.onSelectionChange(onSelectionChange ?? (() => {}))
			term.onRender(onRender ?? (() => {}))
			term.onResize(onResize ?? (() => {}))
			term.onTitleChange(onTitleChange ?? (() => {}))

			if (customKeyEventHandler) {
				term.attachCustomKeyEventHandler(customKeyEventHandler)
			}

			return () => {
				term.dispose()
			}
		}, [
			terminal,
			addons,
			onBinary,
			onCursorMove,
			onData,
			onKey,
			onLineFeed,
			onScroll,
			onSelectionChange,
			onRender,
			onResize,
			onTitleChange,
			customKeyEventHandler,
		])

		useLayoutEffect(() => {
			terminal.current = new Terminal(options)
		}, [terminal, options])

		return <div className={className} ref={terminalRef} />
	}
)

export default Xterm
