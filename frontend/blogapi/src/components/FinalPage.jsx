import React from "react";
import Card from "./Card";
import "./FinalPage.css"
import { useNavigate } from "react-router-dom";

const FinalPage = ({
    score,
    setShowFinalPage,
    setShowQuestionPage,
    topScore,
    setTopScore,
    setScore,
    username,
    setUsername,
    quizId,
}) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (score > topScore){
            setTopScore(score);
        }
        setShowFinalPage(false);
        setShowQuestionPage(true);
        setScore(0);
        setUsername("");
    }
    const handleClickHome = () => {
        navigate("/")
    }
    return (
        <Card>
            <h1 className="heading">
                You reached the end of the game!! , {username}
            </h1>
            <h3 className="primary_text">Your Final Score is  : {score} </h3>

            <button className="play_again_btn" onClick={handleClick}>Play Again?</button>
            <button className="go_back_btn" onClick={handleClickHome}>Go Back Home?</button>
        </Card>
    )
}

export default FinalPage;