import './App.css'
import { useState, useEffect, useRef } from 'react'
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
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('calc_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('calc_history', JSON.stringify(history));
  }, [history]);

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
        e.preventDefault();
      } else if (keyMap[e.key]) {
        handleClick(keyMap[e.key]);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setCursor(e.target.selectionStart);
  };


  const handleInputSelect = (e) => {
    setCursor(e.target.selectionStart);
  };

  const handleClick = (val) => {
    let newInput = input;
    let newCursor = cursor;
    if (val === 'AC') {
      setInput('');
      setResult('');
      setShowError(false);
      setCursor(0);
      return;
    } else if (val === '=') {
      const res = safeEval(input);
      if (res === null || res === undefined || res === '') {
        setShowError(true);
        setResult('');
      } else {
        setInput('0');
        setResult(res);
        setShowError(false);
        setHistory(prev => [
          { expression: input, result: res },
          ...prev
        ]);
        setCursor(1);
      }
      return;
    } else if (val === '⌫') {
      if (cursor > 0) {
        newInput = input.slice(0, cursor - 1) + input.slice(cursor);
        newCursor = cursor - 1;
      }
    } else {
      newInput = input.slice(0, cursor) + val + input.slice(cursor);
      newCursor = cursor + val.length;
    }
    setInput(newInput);
    setCursor(newCursor);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newCursor, newCursor);
      }
    }, 0);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursor, cursor);
    }
  }, [cursor]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex gap-8">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-4 w-80">
          <div className="bg-gray-900 rounded-lg mb-4 p-4 min-h-[64px] flex flex-col items-end">
            <input
              ref={inputRef}
              type="text"
              className="text-gray-400 text-lg min-h-[24px] bg-transparent outline-none w-full text-right overflow-x-auto truncate"
              value={input}
              onChange={handleInputChange}
              onClick={handleInputSelect}
              onKeyUp={handleInputSelect}
              autoFocus
            />
            <div className="text-white text-2xl font-bold min-h-[32px] w-full text-right overflow-x-auto truncate">
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
        <div className="bg-gray-800 rounded-2xl shadow-lg p-4 w-72 h-[500px] overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white text-xl font-bold">History</div>
            {history.length > 0 && (
              <button
                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 text-sm"
                onClick={() => {
                  setHistory([]);
                  sessionStorage.setItem('calc_history', JSON.stringify([]));
                }}
              >
                Clear
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <div className="text-gray-400">No history yet.</div>
          ) : (
            history.map((item, idx) => (
              <div key={idx} className="mb-2 p-2 bg-gray-900 rounded flex items-center justify-between">
                <div>
                  <div className="text-gray-400 text-sm">{item.expression}</div>
                  <div className="text-white text-lg font-bold">= {item.result}</div>
                </div>
                <button
                  className="ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 text-xs"
                  onClick={() => {
                    setInput(item.expression);
                    setCursor(item.expression.length);
                    setTimeout(() => {
                      if (inputRef.current) {
                        inputRef.current.focus();
                        inputRef.current.setSelectionRange(item.expression.length, item.expression.length);
                      }
                    }, 0);
                  }}
                >
                  Edit
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App