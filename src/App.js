import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [nickname, setNickname] = useState('');
  const [prediction, setPrediction] = useState(100000);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [btcPrice, setBtcPrice] = useState(null);
  const [btcLoading, setBtcLoading] = useState(false);

  // 获取比特币当前价格
  const fetchBtcPrice = async () => {
    setBtcLoading(true);
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      const data = await response.json();
      setBtcPrice(data.bitcoin.usd);
    } catch (err) {
      console.error('获取比特币价格失败:', err);
    } finally {
      setBtcLoading(false);
    }
  };

  // 组件加载时获取比特币价格
  useEffect(() => {
    fetchBtcPrice();
    // 每小时刷新一次价格
    const interval = setInterval(fetchBtcPrice, 3600000);
    return () => clearInterval(interval);
  }, []);

  // 获取预测数据
  const fetchPredictions = async () => {
    try {
      const response = await fetch('https://btc-predict-api.btchao.com/api/predict');
      if (!response.ok) throw new Error('获取数据失败');
      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      console.error('获取预测数据错误:', err);
      setMessage(err.message);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchPredictions();
  }, []);

  // 提交预测
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('https://btc-predict-api.btchao.com/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, prediction })
      });
      
      const result = await response.json();
      
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage('预测提交成功！');
        // 提交成功后刷新预测列表
        await fetchPredictions();
      }
    } catch (err) {
      setMessage('提交失败: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="price-display">
        <h2>比特币当前价格</h2>
        {btcLoading ? (
          <p>加载中...</p>
        ) : btcPrice ? (
          <p>${btcPrice.toLocaleString()}</p>
        ) : (
          <p>无法获取价格数据</p>
        )}
      </div>
      <div className="prediction-form">
        <h1>比特币2025年价格预测</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nickname">昵称:</label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="prediction">预测价格: ${prediction.toLocaleString()}</label>
            <input
              id="prediction"
              type="range"
              min="50000"
              max="500000"
              step="10000"
              value={prediction}
              onChange={(e) => setPrediction(Number(e.target.value))}
            />
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? '提交中...' : '提交预测'}
          </button>
        </form>
      </div>
      
      {/* 预测墙显示 */}
      <div className="predictions-wall">
        <h2>预测墙</h2>
        {message && <div className="message">{message}</div>}
        {predictions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>时间</th>
                <th>昵称</th>
                <th>预测价格(USD)</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>{item.nickname}</td>
                  <td>{item.prediction.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>暂无预测数据</p>
        )}
      </div>
      <footer className="app-footer">
        <p>© 2023 比特币2025价格预测</p>
        <div className="footer-links">
          <a href="https://github.com/lovexw/2025btc-predict" target="_blank" rel="noopener noreferrer">
            GitHub项目
          </a>
          <span> | </span>
          <a href="https://www.xiaowuleyi.com/" target="_blank" rel="noopener noreferrer">
            小吴乐意
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
