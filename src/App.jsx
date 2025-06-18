import { useState } from 'react';
import './App.css';

const questions = [
  {
    key: 'simplicity',
    text: '1. Would keeping the pieces of information together lead to a simpler data model and code?'
  },
  {
    key: 'goTogether',
    text: '2. Do the pieces of information have a "has-a," "contains," or similar relationship?'
  },
  {
    key: 'queryAtomicity',
    text: '3. Does the application query the pieces of information together?'
  },
  {
    key: 'updateComplexity',
    text: '4. Are the pieces of information updated together?'
  },
  {
    key: 'archival',
    text: '5. Should the pieces of information be archived at the same time?'
  },
  {
    key: 'cardinality',
    text: '6. Is there a high cardinality (current or growing) in the child side of the relationship?'
  },
  {
    key: 'dataDuplication',
    text: '7. Would data duplication be too complicated to manage and undesired?'
  },
  {
    key: 'documentSize',
    text: '8. Would the combined size of the pieces of information take too much memory or transfer bandwidth for the application?'
  },
  {
    key: 'documentGrowth',
    text: '9. Would the embedded piece grow without bound?'
  },
  {
    key: 'workload',
    text: '10. Would the read/write workload benefit from embedding?'
  },
  {
    key: 'individuality',
    text: '11. For the child side of the relationship, can the pieces exist by themselves without a parent?'
  }
];

const embeddingYesKeys = ['simplicity', 'goTogether', 'queryAtomicity', 'updateComplexity', 'archival', 'workload'];
const embeddingNoKeys = ['cardinality', 'dataDuplication', 'documentSize', 'documentGrowth', 'individuality'];

function App() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setResult('');
    setError('');
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== questions.length) {
      setError('⚠️ Please answer all questions before getting a recommendation.');
      setResult('');
      return;
    }

    const isEmbedding = embeddingYesKeys.every(k => answers[k] === 'yes') &&
                        embeddingNoKeys.every(k => answers[k] === 'no');
    setError('');
    setResult(isEmbedding ? '✅ Recommended Strategy: Embed' : '📂 Recommended Strategy: Reference');
  };

  const progressPercentage = (Object.keys(answers).length / questions.length) * 100;

  return (
    <div className="container">
      <h1>MongoDB Modeling Decision Tool</h1>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="questions-grid">
        {questions.map(({ key, text }, index) => (
          <div 
            key={key} 
            className="question-card"
            style={{ '--card-index': index }}
          >
            <p className="question-text">{text}</p>
            <div className="options">
              <button
                className={`option-btn ${answers[key] === 'yes' ? 'selected' : ''}`}
                onClick={() => handleAnswer(key, 'yes')}
              >
                Yes
              </button>
              <button
                className={`option-btn ${answers[key] === 'no' ? 'selected' : ''}`}
                onClick={() => handleAnswer(key, 'no')}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="submit-section">
        <button className="submit-btn" onClick={handleSubmit}>
          Get Recommendation
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {result && <div className="result">{result}</div>}
    </div>
  );
}

export default App;