import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/apiClient';
import { 
  Quiz, 
  QuizAttempt, 
  calculateQuizResults, 
  getQuizById, 
  submitQuizAttempt,
  MultipleChoiceAnswer,
  CodeCompletionAnswer,
  Badge,
  XpUpdate
} from '../services/quizService';
import '../styles/QuizScreen.css';

// Arayüzler quizService.ts'den içe aktarıldı

const QuizScreen: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  // State tanımlamaları
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<'mc' | 'code'>('mc');
  
  // Çoktan seçmeli sorular için state
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  
  // Kod tamamlama soruları için state
  const [userCode, setUserCode] = useState<string>('');
  
  // Quiz verilerini yükle
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // quizService kullanarak quiz verilerini al
        const quizData = await getQuizById(quizId || '');
        console.log('Quiz verisi yüklendi:', quizData);
        
        if (quizData) {
          setQuiz(quizData);
          
          // Yeni quiz girişimi oluştur
          const newAttempt: QuizAttempt = {
            userId: localStorage.getItem('userId') || 'guest',
            quizId: quizData._id,
            startTime: new Date(),
            completed: false,
            multipleChoiceAnswers: [],
            codeCompletionAnswers: [],
            score: 0,
            passed: false
          };
          
          setQuizAttempt(newAttempt);
          setTimeLeft(quizData.timeLimit * 60); // Saniyeye çevir
          
          // İlk sorunun tipine göre tab'ı ayarla
          if (quizData.multipleChoiceQuestions.length > 0) {
            setCurrentTab('mc');
          } else if (quizData.codeCompletionQuestions.length > 0) {
            setCurrentTab('code');
            setUserCode(quizData.codeCompletionQuestions[0].codeTemplate);
          }
        } else {
          setError('Quiz bulunamadı. Lütfen geçerli bir quiz seçin.');
        }
      } catch (error) {
        console.error('Quiz verisi yüklenirken hata:', error);
        setError('Quiz verisi yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    if (quizId) {
      fetchQuizData();
    }
    
    // Sayfa yüklendiğinde sayfanın en üstüne scroll yap
    window.scrollTo(0, 0);
  }, [quizId]);
  
  // Geri sayım zamanlayıcısı
  useEffect(() => {
    if (!loading && quiz && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleQuizSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [loading, quiz, timeLeft, showResults]);
  
  // Çoktan seçmeli soru cevabını kaydet
  const handleMultipleChoiceAnswer = (optionIndex: number) => {
    // Tek seçimli sorular için
    setSelectedOptions([optionIndex]);
  };
  
  // Kod cevabını kaydet
  const handleCodeChange = (code: string) => {
    setUserCode(code);
  };
  
  // Sonraki soruya geç
  const handleNextQuestion = () => {
    // Mevcut cevabı kaydet
    saveCurrentAnswer();
    
    // Sonraki soru indeksini hesapla
    const totalQuestions = (quiz?.multipleChoiceQuestions.length || 0) + (quiz?.codeCompletionQuestions.length || 0);
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < totalQuestions) {
      setCurrentQuestionIndex(nextIndex);
      
      // Sonraki sorunun tipini belirle
      const mcQuestionsCount = quiz?.multipleChoiceQuestions.length || 0;
      if (nextIndex < mcQuestionsCount) {
        setCurrentTab('mc');
        setSelectedOptions([]);
      } else {
        setCurrentTab('code');
        const codeQuestionIndex = nextIndex - mcQuestionsCount;
        if (quiz?.codeCompletionQuestions[codeQuestionIndex]) {
          setUserCode(quiz.codeCompletionQuestions[codeQuestionIndex].codeTemplate);
        }
      }
    } else {
      // Tüm sorular cevaplandı, quiz'i tamamla
      handleQuizSubmit();
    }
  };
  
  // Önceki soruya dön
  const handlePreviousQuestion = () => {
    // Mevcut cevabı kaydet
    saveCurrentAnswer();
    
    // Önceki soru indeksini hesapla
    const prevIndex = currentQuestionIndex - 1;
    
    if (prevIndex >= 0) {
      setCurrentQuestionIndex(prevIndex);
      
      // Önceki sorunun tipini belirle
      const mcQuestionsCount = quiz?.multipleChoiceQuestions.length || 0;
      if (prevIndex < mcQuestionsCount) {
        setCurrentTab('mc');
        
        // Önceki cevabı yükle
        const prevAnswer = quizAttempt?.multipleChoiceAnswers.find(a => a.questionIndex === prevIndex);
        setSelectedOptions(prevAnswer?.selectedOptions || []);
      } else {
        setCurrentTab('code');
        const codeQuestionIndex = prevIndex - mcQuestionsCount;
        
        // Önceki cevabı yükle
        const prevAnswer = quizAttempt?.codeCompletionAnswers.find(a => a.questionIndex === codeQuestionIndex);
        if (prevAnswer) {
          setUserCode(prevAnswer.userCode);
        } else if (quiz?.codeCompletionQuestions[codeQuestionIndex]) {
          setUserCode(quiz.codeCompletionQuestions[codeQuestionIndex].codeTemplate);
        }
      }
    }
  };
  
  // Mevcut cevabı kaydet
  const saveCurrentAnswer = () => {
    if (!quiz || !quizAttempt) return;
    
    const mcQuestionsCount = quiz.multipleChoiceQuestions.length;
    
    if (currentTab === 'mc' && currentQuestionIndex < mcQuestionsCount) {
      // Çoktan seçmeli soru cevabını kaydet
      const updatedAnswers = [...(quizAttempt.multipleChoiceAnswers || [])];
      const existingAnswerIndex = updatedAnswers.findIndex(a => a.questionIndex === currentQuestionIndex);
      
      const mcAnswer: MultipleChoiceAnswer = {
        questionIndex: currentQuestionIndex,
        selectedOptions: selectedOptions
      };
      
      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = mcAnswer;
      } else {
        updatedAnswers.push(mcAnswer);
      }
      
      setQuizAttempt({
        ...quizAttempt,
        multipleChoiceAnswers: updatedAnswers
      });
    } else if (currentTab === 'code') {
      // Kod tamamlama sorusu cevabını kaydet
      const codeQuestionIndex = currentQuestionIndex - mcQuestionsCount;
      
      const updatedAnswers = [...(quizAttempt.codeCompletionAnswers || [])];
      const existingAnswerIndex = updatedAnswers.findIndex(a => a.questionIndex === codeQuestionIndex);
      
      const codeAnswer: CodeCompletionAnswer = {
        questionIndex: codeQuestionIndex,
        userCode: userCode
      };
      
      if (existingAnswerIndex >= 0) {
        updatedAnswers[existingAnswerIndex] = codeAnswer;
      } else {
        updatedAnswers.push(codeAnswer);
      }
      
      setQuizAttempt({
        ...quizAttempt,
        codeCompletionAnswers: updatedAnswers
      });
    }
  };
  
  // Quiz'i tamamla ve sonuçları hesapla
  const handleQuizSubmit = async () => {
    if (!quiz || !quizAttempt) return;
    
    // Son sorunun cevabını kaydet
    saveCurrentAnswer();
    
    // quizService kullanarak sonuçları hesapla
    const updatedAttempt = calculateQuizResults(quiz, quizAttempt);
    
    try {
      // API'ye sonuçları gönder
      const result = await submitQuizAttempt(updatedAttempt);
      console.log('Quiz sonuçları kaydedildi:', result);
      
      // Rozet ve XP bilgilerini kaydet
      setQuizAttempt({
        ...updatedAttempt,
        badges: result.badges,
        xpUpdate: result.xpUpdate
      });
      
      setShowResults(true);
    } catch (error) {
      console.error('Quiz sonuçları kaydedilirken hata:', error);
      // Hata olsa bile sonuçları göster
      setQuizAttempt(updatedAttempt);
      setShowResults(true);
    }
  };
  
  // Ana sayfaya dön
  const handleReturnToHome = () => {
    navigate('/');
  };
  
  // İlgili algoritma sayfasına git
  const handleGoToAlgorithm = () => {
    if (quiz?.algorithmId) {
      navigate(`/algorithm/${quiz.algorithmId}`);
    }
  };
  
  // Sonuç Sayfası
  const renderResultsPage = () => {
    if (!quiz || !quizAttempt) return null;
    
    const { score, passed, badges, xpUpdate } = quizAttempt as QuizAttempt & { 
      badges?: Badge[],
      xpUpdate?: XpUpdate 
    };
    
    const totalQuestions = (quiz.multipleChoiceQuestions.length || 0) + (quiz.codeCompletionQuestions.length || 0);
    
    return (
      <div className="quiz-results">
        <div className="results-header">
          <h2>{passed ? 'Tebrikler!' : 'Üzgünüm!'}</h2>
          <p className={`results-status ${passed ? 'pass' : 'fail'}`}>
            {passed 
              ? 'Quiz\'i başarıyla tamamladınız!' 
              : 'Bu kez başarılı olamadınız. Tekrar deneyebilirsiniz.'}
          </p>
        </div>
        
        <div className="results-score">
          <div className="score-circle">
            <div className="score-number">{score}</div>
            <div className="score-total">/ {quiz.totalPoints}</div>
          </div>
          <div className="score-label">
            Puanınız
          </div>
          <div className="passing-score">
            Geçme Puanı: {quiz.passingScore}
          </div>
        </div>
        
        {/* XP kazanımını göster */}
        {xpUpdate && xpUpdate.gained > 0 && (
          <div className="xp-earned">
            <div className="xp-icon">✨</div>
            <div className="xp-info">
              <span className="xp-value">+{xpUpdate.gained} XP</span> kazandınız!
              {xpUpdate.levelUp && (
                <div className="level-up">Seviye atladınız! Yeni seviyeniz: {xpUpdate.newLevel}</div>
              )}
            </div>
          </div>
        )}
        
        {/* Kazanılan rozetleri göster */}
        {badges && badges.length > 0 && (
          <div className="earned-badges">
            <h3>Kazanılan Rozetler</h3>
            <div className="badges-container">
              {badges.map(badge => (
                <div key={badge.type} className="badge-item">
                  <div className="badge-icon">{badge.icon}</div>
                  <div className="badge-info">
                    <div className="badge-name">{badge.name}</div>
                    <div className="badge-xp">+{badge.xpReward} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="results-summary">
          <h3>Performans Özeti</h3>
          
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-value">{totalQuestions}</div>
              <div className="stat-label">Toplam Soru</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-value">
                {quizAttempt.multipleChoiceAnswers.filter(a => a.isCorrect).length + 
                 quizAttempt.codeCompletionAnswers.filter(a => a.isCorrect).length}
              </div>
              <div className="stat-label">Doğru Cevap</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-value">
                {totalQuestions - 
                 (quizAttempt.multipleChoiceAnswers.filter(a => a.isCorrect).length + 
                  quizAttempt.codeCompletionAnswers.filter(a => a.isCorrect).length)}
              </div>
              <div className="stat-label">Yanlış Cevap</div>
            </div>
          </div>
        </div>
        
        <div className="results-actions">
          <button 
            className="action-button secondary"
            onClick={handleReturnToHome}
          >
            Ana Sayfaya Dön
          </button>
          
          {quiz.algorithmId && (
            <button 
              className="action-button primary"
              onClick={handleGoToAlgorithm}
            >
              İlgili Algoritmaya Git
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // Ana render fonksiyonu
  if (loading) {
    return (
      <div className="quiz-screen loading">
        <div className="loading-spinner"></div>
        <p>Quiz yükleniyor...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="quiz-screen error">
        <h2>Hata</h2>
        <p>{error}</p>
        <button className="quiz-button" onClick={() => navigate('/')}>
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }
  
  if (!quiz) {
    return (
      <div className="quiz-screen error">
        <h2>Quiz Bulunamadı</h2>
        <p>İstediğiniz quiz bulunamadı veya mevcut değil.</p>
        <button className="quiz-button" onClick={() => navigate('/')}>
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }
  
  if (showResults) {
    return (
      <div className="quiz-screen results">
        <div className="quiz-container">
          <h1 className="quiz-title">{quiz.title} - Sonuçlar</h1>
          {renderResultsPage()}
        </div>
      </div>
    );
  }
  
  // Quiz sorusunu göster
  const mcQuestionsCount = quiz.multipleChoiceQuestions.length;
  const currentMCQuestion = currentTab === 'mc' && currentQuestionIndex < mcQuestionsCount ? 
    quiz.multipleChoiceQuestions[currentQuestionIndex] : null;
  
  const currentCodeQuestion = currentTab === 'code' ? 
    quiz.codeCompletionQuestions[currentQuestionIndex - mcQuestionsCount] : null;
  
  const totalQuestions = mcQuestionsCount + quiz.codeCompletionQuestions.length;
  
  // Zaman formatını ayarla
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <a href="#" className="back-button" onClick={(e) => { e.preventDefault(); navigate(-1); }}>
          ←
        </a>
        <h1>{quiz.title}</h1>
        <div className="quiz-timer">
          <span className={timeLeft < 60 ? 'timer-warning' : ''}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      
      <div className="quiz-info">
        <div className="quiz-description">
          <p>{quiz.description}</p>
        </div>
        
        <div className="quiz-meta">
          <div className="difficulty-badge" style={{ 
            backgroundColor: 
              quiz.difficulty === 'Kolay' ? '#27ae60' : 
              quiz.difficulty === 'Orta' ? '#f39c12' : 
              '#e74c3c' 
          }}>
            {quiz.difficulty}
          </div>
          <div className="question-counter">
            Soru {currentQuestionIndex + 1} / {totalQuestions}
          </div>
        </div>
      </div>
      
      <div className="question-container">
        {currentMCQuestion && (
          <div className="mc-question">
            <h3 className="question-text">{currentMCQuestion.question}</h3>
            
            <div className="options-list">
              {currentMCQuestion.options.map((option, index) => (
                <div 
                  key={index} 
                  className={`option-item ${selectedOptions.includes(index) ? 'selected' : ''}`}
                  onClick={() => handleMultipleChoiceAnswer(index)}
                >
                  <span className="option-text">{option.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {currentCodeQuestion && (
          <div className="code-question">
            <h3 className="question-text">{currentCodeQuestion.question}</h3>
            
            <div className="code-editor">
              <textarea
                className="code-textarea"
                value={userCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                rows={10}
              />
            </div>
            
            <div className="hints-container">
              <h4>İpuçları:</h4>
              <ul className="hints-list">
                {currentCodeQuestion.hints.map((hint, index) => (
                  <li key={index} className="hint-item">{hint}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div className="navigation-buttons">
        <button 
          className="nav-button"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Önceki
        </button>
        
        {currentQuestionIndex < totalQuestions - 1 ? (
          <button 
            className="nav-button primary"
            onClick={handleNextQuestion}
          >
            Sonraki
          </button>
        ) : (
          <button 
            className="nav-button submit"
            onClick={handleQuizSubmit}
          >
            Quiz'i Tamamla
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;