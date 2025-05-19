import './App.css'
import { useState, useEffect } from 'react'
import Button from './components/Button'

const buttons = [
  ['AC'],
  ['(', ')', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['0', '.', '⌫', '='],
];

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [showError, setShowError] = useState(false);

  const safeEval = (expr) => {
    try {
      let exp = expr
        .replace(/÷/g, '/')
        .replace(/×/g, '*')
        .replace(/−/g, '-')
        .replace(/(\d+(?:\.\d+)?)%([\d.]+)/g, '($1*$2/100)');
      exp = exp.replace(/\b0+(\d+)/g, '$1');
      return eval(exp);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (input) {
      const res = safeEval(input);
      if (res === null) {
        setResult('');
      } else {
        setResult(res);
      }
      setShowError(false);
    } else {
      setResult('');
      setShowError(false);
    }
  }, [input]);

  useEffect(() => {
    const keyMap = {
      '/': '÷',
      '*': '×',
      '-': '−',
      '+': '+',
      '%': '%',
      '(': '(',
      ')': ')',
      '.': '.',
      Enter: '=',
      '=': '=',
      Backspace: '⌫',
      Escape: 'AC',
      Delete: 'AC',
    };
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleClick(e.key);
      } else if (keyMap[e.key]) {
        handleClick(keyMap[e.key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleClick = (val) => {
    if (val === 'AC') {
      setInput('');
      setResult('');
      setShowError(false);
    } else if (val === '=') {
      const res = safeEval(input);
      if (res === null || res === undefined || res === '') {
        setShowError(true);
        setResult('');
      } else {
        setInput(res.toString());
        setResult(res);
        setShowError(false);
      }
    } else if (val === '⌫') {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + val);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-2xl shadow-lg p-4 w-80">
        <div className="bg-gray-900 rounded-lg mb-4 p-4 min-h-[64px] flex flex-col items-end">
          <input
            type="text"
            className="text-gray-400 text-lg min-h-[24px] bg-transparent outline-none w-full text-right"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <div className="text-white text-2xl font-bold min-h-[32px]">
            {showError ? 'Err' : result !== '' ? result : ''}
          </div>
        </div>
        <div>
          {buttons.map((row, i) => (
            <div key={i} className="flex justify-center">
              {row.map((btn) => (
                <Button
                  key={btn}
                  onClick={() => handleClick(btn)}
                  className={
                    btn === 'AC'
                      ? 'bg-purple-700 hover:bg-purple-600'
                      : btn === '='
                      ? 'bg-blue-700 hover:bg-blue-600'
                      : btn === '⌫'
                      ? 'bg-gray-500 hover:bg-gray-400'
                      : ''
                  }
                >
                  {btn}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App