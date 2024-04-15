import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Radio,
  FormControlLabel,
  MenuItem,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { makeStyles } from '@material-ui/core/styles';
import axiosInstance from '../axios';

const useStyles = makeStyles((theme) => ({
    cardContainer: {
        maxWidth: '600px',
        margin: 'auto',
        marginTop: '20px',
        padding: theme.spacing(3),
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    questionContainer: {
        marginTop: theme.spacing(2),
        padding: '10px',
    },
    optionContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        padding: '13px',
    },
    addOptionBtn: {
        marginLeft: theme.spacing(1),
    },
    removeOptionBtn: {
        marginLeft: theme.spacing(1),
        color: theme.palette.error.main,
    },
    addQuestionBtn: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        },
    },
    submitBtn: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.secondary.main,
        color: '#fff',
        '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        },
        marginLeft: '20px',
    },
    deleteButton: {
        position: 'absolute',
        top: '100px',
        color:'red',
    },
    errMgs:{
        marginTop: '20px',
        fontSize:'30px',
        textAlign: 'center',
        color: 'red',
    }
}));

const QuizUpdate = () => {
    const classes = useStyles();
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quizData, setQuizData] = useState({
        title: '',
        level: 'easy',
        status: 'draft',
        questions: [
        { text: '', options: ['', ''], correctOption: 0 },
        ],
    });
    const [errMgs , setErrMgs] = useState("");
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                axiosInstance.get(`/quiz/user/${quizId}/`)
                .then(
                    (res) => {
                        console.log(res.data)
                        if(res.data){
                            const { id, title, level, status , parent_quiz } = res.data;
                            const transformedData = {
                            id,
                            title,
                            level,
                            status,
                            questions: parent_quiz.map(({ id: questionId, question, parent_question }) => ({
                                text: question,
                                options: parent_question.map(({ answer }) => answer),
                                correctOption: parent_question.findIndex(({ is_true }) => is_true),
                                })),
                            };
                            console.log(transformedData)
                            setQuizData(transformedData);
                        }else{
                            setErrMgs("You don't have access to update this Quiz as you are not quizzer!!")
                        }
                    })
                .catch((err)=> {
                    if (err.response){
                        setErrMgs(err.response.statusText)                        
                    }else{
                        setErrMgs("Error while Fetching Data!!")                         
                    }
                })
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        };

    fetchQuizData();
    }, [quizId]);

    const handleTitleChange = (e) => {
        setQuizData({
        ...quizData,
        title: e.target.value,
        });
    };

    const handlelevelChange = (e) => {
        setQuizData({
        ...quizData,
        level: e.target.value,
        });
    };
    const handleStatusChange = (e) => {
        setQuizData({
          ...quizData,
          status: e.target.value,
        });
      };

    const handleQuestionChange = (questionIndex, field, value) => {
        const updatedQuestions = [...quizData.questions];
        updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [field]: value,
        };

        setQuizData({
        ...quizData,
        questions: updatedQuestions,
        });
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...quizData.questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;

        setQuizData({
        ...quizData,
        questions: updatedQuestions,
        });
    };

    const handleAddQuestion = () => {
        setQuizData({
        ...quizData,
        questions: [
            ...quizData.questions,
            { text: '', options: ['', ''], correctOption: 0 },
        ],
        });
    };

    const handleRemoveQuestion = (questionIndex) => {
        const updatedQuestions = [...quizData.questions];
        if (updatedQuestions.length > 1) {
        updatedQuestions.splice(questionIndex, 1);
        setQuizData({
            ...quizData,
            questions: updatedQuestions,
        });
        }
    };

    const handleAddOption = (questionIndex) => {
        const updatedQuestions = [...quizData.questions];
        if (updatedQuestions[questionIndex].options.length < 4) {
        updatedQuestions[questionIndex].options.push('');
        setQuizData({
            ...quizData,
            questions: updatedQuestions,
        });
        }
    };

    const handleRemoveOption = (questionIndex, optionIndex) => {
        const updatedQuestions = [...quizData.questions];
        if (updatedQuestions[questionIndex].options.length > 2) {
        updatedQuestions[questionIndex].options.splice(optionIndex, 1);
        setQuizData({
            ...quizData,
            questions: updatedQuestions,
        });
        }
    };

    const handleDeleteQuiz = () => {

        if(window.confirm("Are you sure want to delete this quiz?")){
            console.log("nani")
            try{
                axiosInstance.delete(`/quiz/user/${quizId}`)
                .then(
                    (res) => {
                        console.log(res)
                        if (res.status === 200){
                            navigate("/user")
                        }else{
                            alert("Error while deleting data..")
                        }
                    }
                )
                .catch(err => alert(err))
            }catch(err) {
                alert(err)
            }
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your logic to submit the updated quiz data
        const isValid = quizData.questions.every(
            (question) => question.text.trim() !== '' && question.options.every((option) => option.trim() !== '')
        );
        if (!isValid || quizData.questions.length <= 0) {
            alert('Please fill in all required fields (at least one question and one option per question).');
            return;
        }else{
            try{
                axiosInstance.put(`/quiz/user/${quizId}/`,quizData)
                .then(
                    (res) => {
                        console.log(res)
                        if (res.status === 200){
                            navigate("/user")
                        }else{
                            alert("Error while deleting data..")
                        }
                    }
                )
                .catch(err => alert(err))
            }catch(err) {
                alert(err)
            }
        }
        console.log('Updated Quiz Data:', quizData);

        // // Redirect to the quiz details page or any other appropriate page
        // navigate(`/quiz/${quizId}`);
    };

  return (
    <Container>
        {errMgs === '' &&
            <Paper className={classes.cardContainer}>
                <IconButton
                    onClick={handleDeleteQuiz}
                    className={classes.deleteButton}
                    color="secondary"
                    aria-label="delete"
                    >
                    <DeleteForeverIcon />
                </IconButton>                
                <Typography variant="h4" align="center" gutterBottom>
                Edit Quiz
                </Typography>
                <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Title"
                    variant="outlined"
                    margin="normal"
                    value={quizData.title}
                    onChange={handleTitleChange}
                />
                <TextField
                    fullWidth
                    select
                    label="Level"
                    variant="outlined"
                    margin="normal"
                    value={quizData.level}
                    onChange={handlelevelChange}
                >
                    <MenuItem value="easy">Easy</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="hard">Hard</MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    select
                    label="Status"
                    variant="outlined"
                    margin="normal"
                    value={quizData.status}
                    onChange={handleStatusChange}
                >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                </TextField>                

                {quizData.questions.map((question, questionIndex) => (
                    <Paper key={questionIndex} elevation={3} className={classes.questionContainer}>
                    <TextField
                        fullWidth
                        label={`Question ${questionIndex + 1}`}
                        variant="outlined"
                        margin="normal"
                        value={question.text}
                        onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                    />

                    {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className={classes.optionContainer}>
                        <FormControlLabel
                            control={
                            <Radio
                                checked={question.correctOption === optionIndex}
                                onChange={() =>
                                handleQuestionChange(questionIndex, 'correctOption', optionIndex)
                                }
                            />
                            }
                            label={`${optionIndex + 1}`}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            placeholder={`Enter option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                        />
                        <IconButton
                            onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                        >
                            <RemoveIcon />
                        </IconButton>
                        </div>
                    ))}

                    <IconButton onClick={() => handleAddOption(questionIndex)}>
                        <AddIcon />
                    </IconButton>

                    <Button
                        type="button"
                        onClick={() => handleRemoveQuestion(questionIndex)}
                        variant="outlined"
                        color="secondary"
                    >
                        Remove Question
                    </Button>
                    </Paper>
                ))}

                <Button
                    type="button"
                    onClick={handleAddQuestion}
                    variant="contained"
                    className={classes.addQuestionBtn}
                >
                    Add Question
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    className={classes.submitBtn}
                >
                    Update
                </Button>
                </form>
            </Paper>
        }
        {errMgs !== '' && 
            <p className={classes.errMgs}>{errMgs}</p>
        }
    </Container>
  );
};

export default QuizUpdate;