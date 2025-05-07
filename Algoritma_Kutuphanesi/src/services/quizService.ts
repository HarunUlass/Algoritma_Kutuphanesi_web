import { api } from './apiClient';

// Quiz türleri
export interface MultipleChoiceQuestion {
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface CodeCompletionQuestion {
  question: string;
  codeTemplate: string;
  solution: string;
  hints: string[];
}

export interface Quiz {
  _id: string;
  algorithmId: string;
  title: string;
  description: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  timeLimit: number;
  multipleChoiceQuestions: MultipleChoiceQuestion[];
  codeCompletionQuestions: CodeCompletionQuestion[];
  totalPoints: number;
  passingScore: number;
}

// Kullanıcı cevapları için türler
export interface MultipleChoiceAnswer {
  questionIndex: number;
  selectedOptions: number[];
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface CodeCompletionAnswer {
  questionIndex: number;
  userCode: string;
  isCorrect?: boolean;
  pointsEarned?: number;
  feedback?: string;
}

// Rozet tipini tanımlayalım
export interface Badge {
  type: string;
  name: string;
  icon: string;
  xpReward: number;
}

// XP güncellemesi için arayüz
export interface XpUpdate {
  gained: number;
  levelUp: boolean;
  newLevel?: number;
}

export interface QuizAttempt {
  userId: string;
  quizId: string;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  multipleChoiceAnswers: MultipleChoiceAnswer[];
  codeCompletionAnswers: CodeCompletionAnswer[];
  score: number;
  passed: boolean;
  badges?: Badge[]; // Kazanılan rozetler
  xpUpdate?: XpUpdate; // XP güncelleme bilgisi
}

// Quiz verilerini getir
export const getQuizById = async (quizId: string): Promise<Quiz | null> => {
  try {
    const quizData = await api.quiz.getById(quizId);
    return quizData;
  } catch (error) {
    console.error('Quiz verisi alınırken hata:', error);
    return null;
  }
};

// Algoritma ID'sine göre quiz getir
export const getQuizByAlgorithmId = async (algorithmId: string): Promise<Quiz | null> => {
  try {
    const quizData = await api.quiz.getByAlgorithmId(algorithmId);
    return quizData;
  } catch (error) {
    console.error('Algoritma için quiz verisi alınırken hata:', error);
    return null;
  }
};

// Quiz girişimi gönder
export const submitQuizAttempt = async (attemptData: QuizAttempt): Promise<any> => {
  try {
    const result = await api.quiz.submitAttempt(attemptData);
    return result;
  } catch (error) {
    console.error('Quiz girişimi gönderilirken hata:', error);
    throw error;
  }
};

// Kullanıcının quiz girişimlerini getir
export const getUserQuizAttempts = async (userId: string): Promise<QuizAttempt[]> => {
  try {
    const attempts = await api.quiz.getUserAttempts(userId);
    return attempts;
  } catch (error) {
    console.error('Kullanıcı quiz girişimleri alınırken hata:', error);
    return [];
  }
};

// Quiz sonuçlarını hesapla
export const calculateQuizResults = (quiz: Quiz, quizAttempt: QuizAttempt): QuizAttempt => {
  // Çoktan seçmeli soruların puanlarını hesapla
  const mcAnswers = quizAttempt.multipleChoiceAnswers.map(answer => {
    const question = quiz.multipleChoiceQuestions[answer.questionIndex];
    const isCorrect = question.options.every((option, index) => {
      const isSelected = answer.selectedOptions.includes(index);
      return option.isCorrect === isSelected;
    });
    
    return {
      ...answer,
      isCorrect,
      pointsEarned: isCorrect ? 10 : 0 // Her doğru cevap 10 puan
    };
  });
  
  // Kod tamamlama sorularının puanlarını hesapla
  const codeAnswers = quizAttempt.codeCompletionAnswers.map(answer => {
    const question = quiz.codeCompletionQuestions[answer.questionIndex];
    
    // Basit bir karşılaştırma
    const normalizedUserCode = answer.userCode.replace(/\s+/g, ' ').trim();
    const normalizedSolution = question.solution.replace(/\s+/g, ' ').trim();
    const isCorrect = normalizedUserCode === normalizedSolution;
    
    return {
      ...answer,
      isCorrect,
      pointsEarned: isCorrect ? 20 : 0, // Her doğru cevap 20 puan
      feedback: isCorrect ? 'Doğru çözüm!' : 'Çözümünüz beklenen sonuçla eşleşmiyor.'
    };
  });
  
  // Toplam puanı hesapla
  const totalScore = [
    ...mcAnswers.map(a => a.pointsEarned || 0),
    ...codeAnswers.map(a => a.pointsEarned || 0)
  ].reduce((sum, points) => sum + points, 0);
  
  // Quiz girişimini güncelle
  return {
    ...quizAttempt,
    multipleChoiceAnswers: mcAnswers,
    codeCompletionAnswers: codeAnswers,
    score: totalScore,
    passed: totalScore >= quiz.passingScore,
    completed: true,
    endTime: new Date()
  };
};

// Tüm quizleri getir
export const getAllQuizzes = async (): Promise<Quiz[]> => {
  try {
    const quizzes = await api.quiz.getAll();
    console.log('Alınan ham quiz verileri:', quizzes);
    
    // Ensure each quiz has the required properties
    return (quizzes || []).map((quiz: any) => ({
      ...quiz,
      multipleChoiceQuestions: quiz.multipleChoiceQuestions || [],
      codeCompletionQuestions: quiz.codeCompletionQuestions || []
    }));
  } catch (error) {
    console.error('Quiz listesi alınırken hata:', error);
    return [];
  }
};