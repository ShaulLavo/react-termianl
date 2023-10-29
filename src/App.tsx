import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ITerminalOptions, Terminal as TerminalType } from 'xterm';

function App() {
  return (
    <div className="text-3xl font-bold underline">
      <Terminal />
    </div>
  );
}

export default App;
function colorWord(
  word: string,
  red: number,
  green: number,
  blue: number
): string {
  const colorCode = `\x1b[38;2;${red};${green};${blue}m`;
  const resetCode = '\x1b[0m';
  return colorCode + word + resetCode;
}
import Xterm from './Xterm';
import { Readline } from 'xterm-readline';
import { FitAddon } from 'xterm-addon-fit';

function Terminal() {
  const [rl] = useState(new Readline());
  const [fitAddon] = useState(new FitAddon());
  const terminal = useRef<TerminalType>(null!);
  const currentLine = useRef<string>('');
  const arrow = colorWord('➜', 99, 240, 140);
  const js = colorWord(' 18.12.1', 152, 195, 121);

  const options: ITerminalOptions = {
    fontFamily: 'JetBrainsMonoNerdFont-Regular',
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: '500',
    cursorBlink: true,
    theme: {
      background: '#1b1e28',
      // foreground: '#fff',
    },
  };

  function eraseLine() {
    rl.write('\x1b[2K');
  }
  const setCursor = (row: number, column: number) => {
    rl.write(`\x1B[${row};${column}H`);
  };

  function handleEnter(line: string) {
    line = line.trim().toLowerCase();
    switch (line) {
      case 'clr':
      case 'clear': {
        terminal.current.clear();
      }
    }
  }


  async function readLine() {
    const root = colorWord('root', 193, 54, 40);
    const localhost = colorWord('localhost', 85, 185, 196);
    await rl.read(`${root} in ${localhost} via ${js} \n  ${arrow} `).then(handleEnter);
    setTimeout(readLine);
  }

  function onKey(event: { key: string; domEvent: KeyboardEvent; }): void {
    const ev = event.domEvent;
    const isPrintable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
    isPrintable;
    const lineIndex = terminal.current.buffer.active.cursorY;
    const line = terminal.current.buffer.active.getLine(lineIndex);
    const lineString = line?.translateToString(false) ?? '';
    const lineText = lineString.trimEnd();
    const words = lineString.split(' ');
    console.log(words);
    if (event.key === ' ') {
      words[3] = colorWord(words[3], 0, 0, 255);
      words[2] = arrow;
      rl.write('\r');
      // rl.write(words.join(' '))
      rl.write(`\r${words.join(' ')} \x1B[K`); // Update the line and clear to the end of the line
    }
  }
  useEffect(() => {
    readLine();
  }, []);

  return (
    <Xterm
      onKey={onKey}
      addons={[rl, fitAddon]}
      options={options}
      ref={terminal}
    />
  );
}
