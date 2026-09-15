import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>TEST_WEB</h1>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        count is {count}
      </button>
    </main>
  );
}

export default App;
