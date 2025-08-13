import React, { useState } from 'react';
import './App.css';

function App() {
  const [nickname, setNickname] = useState('');
  const [prediction, setPrediction] = useState(50000);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ nickname, prediction });
    // 这里后续会添加数据存储逻辑
  };

  return (
    <div className="App">
      <h1>比特币2025年价格预测</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>昵称:</label>
          <input 
            type="text" 
            value={nickname} 
            onChange={(e) => setNickname(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>预测价格:</label>
          <input
            type="range"
            min="50000"
            max="500000"
            step="10000"
            value={prediction}
            onChange={(e) => setPrediction(Number(e.target.value))}
          />
          <div className="prediction-value">${prediction.toLocaleString()}</div>
        </div>
        <button type="submit">提交预测</button>
      </form>
    </div>
  );
}

export default App;
