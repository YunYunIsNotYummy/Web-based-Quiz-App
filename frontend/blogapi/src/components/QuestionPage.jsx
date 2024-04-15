import React, { useState } from "react";
import Question from './Question';

const QuestionPage = ({
    score,
    setScore,
    questions,
    setShowQuestionPage,
    setShowFinalPage,
}) => {
    const [questionIndex, setQuestionIndex] = useState(0);
    return (
        <>
        {questions && Object.keys(questions).length !== 0 && (
          <Question
            questionIndex={questionIndex}
            questions={questions}
            setQuestionIndex={setQuestionIndex}
            setShowQuestionPage={setShowQuestionPage}
            setShowFinalPage={setShowFinalPage}
            score={score}
            setScore={setScore}
          />
        )}
        </>
    );
}

export default QuestionPage;