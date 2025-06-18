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

    let embeddingPoints = 0;
    let referencePoints = 0;

    // Count points for each question
    Object.keys(answers).forEach(key => {
      if (embeddingYesKeys.includes(key)) {
        // For embedding-favorable questions: "yes" = +1 for embedding, "no" = +1 for reference
        if (answers[key] === 'yes') {
          embeddingPoints++;
        } else {
          referencePoints++;
        }
      } else if (embeddingNoKeys.includes(key)) {
        // For embedding-unfavorable questions: "no" = +1 for embedding, "yes" = +1 for reference
        if (answers[key] === 'no') {
          embeddingPoints++;
        } else {
          referencePoints++;
        }
      }
    });

    setError('');
    
    if (embeddingPoints > referencePoints) {
      setResult(`✅ Recommended Strategy: Embed (${embeddingPoints}/11 points)`);
    } else if (referencePoints > embeddingPoints) {
      setResult(`📂 Recommended Strategy: Reference (${referencePoints}/11 points)`);
    } else {
      setResult(`⚖️ Tie Score (${embeddingPoints}-${referencePoints}): Consider both approaches based on your specific use case`);
    }
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