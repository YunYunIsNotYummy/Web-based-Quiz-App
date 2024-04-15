import React from "react";
import { useState, useEffect } from "react";
import "./quiz.css";
import FinalPage from "./FinalPage";
import QuestionPage from "./QuestionPage";
import { useParams } from 'react-router-dom';
import axiosInstance from '../axios';

function Quiz() {
    const { id } = useParams();
    const [showQuestionPage, setShowQuestionPage] = useState(true);
    const [showFinalPage, setShowFinalPage] = useState(false);
    
    const [score, setScore] = useState(0);
    const [topScore, setTopScore] = useState(0);
    const [username, setUsername] = useState("");
    const [questions, setQuestions] = useState([]);
    const [quizId, setQuizId] = useState(0);
    console.log(id)

    useEffect(() => {
        // Fetch detailed data using the id
        axiosInstance.get(`/quiz/${id}/`).then(
            (res) => {
                const allQuizzes = res.data;
                setQuestions(allQuizzes)
                setQuizId(id)
            }
        );
      }, [id]);

    return (
        <>
            {showQuestionPage  && (
                <QuestionPage
                    score={score}
                    setScore={setScore}
                    setShowQuestionPage={setShowQuestionPage}
                    setShowFinalPage={setShowFinalPage}
                    questions={questions}
                />
            )}
            {showFinalPage && (
                <FinalPage
                    score={score}
                    setScore={setScore}
                    topScore={topScore}
                    setTopScore={setTopScore}
                    setShowQuestionPage={setShowQuestionPage}
                    setShowFinalPage={setShowFinalPage}
                    username={username}
                    setUsername={setUsername}
                    quizId = {quizId}
                    />
            )}
        </>
    );
}

export default Quiz;