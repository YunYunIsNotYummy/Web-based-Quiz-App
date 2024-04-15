import React, { useState , useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
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
import axiosInstance from '../axios';

const useStyles = makeStyles((theme) => ({
  quizFormContainer: {
    maxWidth: '600px',
    margin: 'auto',
    marginTop:'20px',
    padding: theme.spacing(3),
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  questionContainer: {
    marginTop: theme.spacing(2),
    padding:'10px',
  },
  optionContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    padding:'13px',
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
    marginLeft:'20px',
  },
}));

const QuizCreate = () => {

    const navi = useNavigate()
  const classes = useStyles();
  const [quizData, setQuizData] = useState({
    title: '',
    difficulty: 'easy', 
    status: 'draft',
    questions: [
      { text: '', options: ['', ''], correctOption: 0 },
    ],
  });

  useEffect(() => {
    // Check user authentication on component mount
    const isUserAuthenticated = localStorage.getItem('access_token') !== null;
    // Redirect to login if not authenticated
    if (!isUserAuthenticated) {
      navi("/login")
    }
  }, [navi]); // Add history to the dependency array


  const handleTitleChange = (e) => {
    setQuizData({
      ...quizData,
      title: e.target.value,
    });
  };
  const handleDifficultyChange = (e) => {
    setQuizData({
      ...quizData,
      difficulty: e.target.value,
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation: Check if there is at least one question and one option per question
        const isValid = quizData.questions.every(
            (question) => question.text.trim() !== '' && question.options.every((option) => option.trim() !== '')
        );

        if (!isValid) {
            alert('Please fill in all required fields (at least one question and one option per question).');
            return;
        }else{
            axiosInstance.post('/quiz/user/0/',quizData)
            .then(
                (res) => {
                    if (res.status === 201){
                        navi("/user")
                    }
                }
            )
        }

        console.log('Quiz Data:', quizData);
    };

  return (
    <Container className={classes.quizFormContainer}>
      <Typography variant="h4" align="center" gutterBottom>
        Create a Quiz
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
            label="Difficulty"
            variant="outlined"
            margin="normal"
            value={quizData.difficulty}
            onChange={handleDifficultyChange}
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
                      onChange={() => handleQuestionChange(questionIndex, 'correctOption', optionIndex)}
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
                  className={classes.removeOptionBtn}
                  onClick={() => handleRemoveOption(questionIndex, optionIndex)}
                >
                  <RemoveIcon />
                </IconButton>
              </div>
            ))}

            <IconButton
              className={classes.addOptionBtn}
              onClick={() => handleAddOption(questionIndex)}
            >
              <AddIcon />
            </IconButton>

            <Button
              type="button"
              onClick={() => handleRemoveQuestion(questionIndex)}
              className={classes.removeQuestionBtn}
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
          className={classes.addQuestionBtn}
          variant="contained"
        >
          Add Question
        </Button>

        <Button
          type="submit"
          className={classes.submitBtn}
          variant="contained"
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default QuizCreate;