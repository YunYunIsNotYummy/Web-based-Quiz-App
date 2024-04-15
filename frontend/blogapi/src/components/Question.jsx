import React from "react";
import Card from "./Card";
import "./Question.css"

const Question = ({
    questionIndex,
    setQuestionIndex,
    questions,
    setShowQuestionPage,
    setShowFinalPage,
    score,
    setScore,
}) => {
    const handleClick = (isCorrect) => {
        if (questions['parent_quiz'].hasOwnProperty(questionIndex+1)) {
            if (isCorrect){
                setScore((score)=> score+=100);
            }
            setQuestionIndex((prevIndex)=> prevIndex + 1);
        }else{
            if (isCorrect){
                setScore((score)=> score+=100);                
            }
            setShowQuestionPage(false);
            setShowFinalPage(true)
        }
    }
    return (
        <Card>
            <h3 className="question">{questions['parent_quiz'][questionIndex].question}</h3>
            <div className="answers">
                {questions['parent_quiz'][questionIndex].parent_question.map((answer,index) => (
                    <div
                        className="answer"
                        key={index}
                        onClick={()=> handleClick(answer.is_true)}
                    > 
                        <p>{answer.answer}</p>
                    </div>
                ))}
            </div>
            <div className="scorefooter">
                <p className="score">
                    Score : <span>{score}</span>
                </p>
                <p className="question_number">
                    Question <span>{questionIndex + 1}</span>/ {questions['parent_quiz'].length}
                </p>
            </div>
        </Card>
    )
}

export default Question