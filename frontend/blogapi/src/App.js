import React, { useEffect, useState } from 'react';
import './App.css';
import Posts from './components/posts';
import PostLoadingComponent from './components/postLoading';
import axiosInstance from './axios';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';

function App() {
    const navi = useNavigate();
    const location = useLocation();
    const PostLoading = PostLoadingComponent(Posts);
    const [appState, setAppState] = useState({
        loading: true,
        posts: null,
    });
    const [pageHeader,setPageHeader] = useState("Available Quizzes")
    const [publicQuiz,setPublicQuiz] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                console.log(location.pathname)
                if (location.pathname.startsWith('/user')) {
                    response = await axiosInstance.post(`/user`);
                    setPageHeader("Your Created Quizzes")
                    setPublicQuiz(false);
                } else {
                    response = await axiosInstance.get();
                    setPageHeader("Available Quizzes")
                    setPublicQuiz(true);
                }
                setAppState({ loading: false, posts: response.data });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Unauthorized, redirect to login
                    navi('/login');
                } else {
                    console.error(error);
                }
            }
        };
        fetchData();
    }, [location.pathname, navi]);

    return (
        <div className="App">
            <h1>{pageHeader}</h1>
            {!publicQuiz && 
                <Button
                    href="#"
                    color="primary"
                    variant="outlined"
                    component={NavLink}
                    style={{ marginBottom: '10px' }}
                    to="/quiz/create"
                    >
                    Create More
                </Button>
            }
            <PostLoading isLoading={appState.loading} posts={appState.posts} />
            {publicQuiz &&
                <p className='infoPublicQuiz'> 
                    Above Quizzes are from the others who have published!! <br/> 
                    No post means no one has not published !! <br/> 
                    Please Register / Login to create quiz  <br/> 
                    If you've logged in , Go or Click <b>Your Quizzes</b> in the navbar to create!! 
                </p>
            }
        </div>
    );
}

export default App;