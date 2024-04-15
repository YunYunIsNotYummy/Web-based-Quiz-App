import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import App from './App';
import Header from './components/header';
import Footer from './components/footer';
import Register from './components/register';
import Login from './components/login';
import Logout from './components/logout';
import Quiz from './components/quiz';
import QuizCreate from './components/quizCreate';
import QuizUpdate from './components/quizupdate';

const routing = (
	<Router>
		<React.StrictMode>
			<Header />
			<Routes>
				<Route exact path="/" element={<App/>} />
				<Route path="/register" element={<Register/>} />
				<Route path="/login" element={<Login/>} />
				<Route path="/logout" element={<Logout/>} />
				<Route path="/user" element={<App/>} />
				<Route path="/quiz/:id" element={<Quiz />} />
				<Route path="/quiz/create" element={<QuizCreate />} />
				<Route path="/quiz/update/:quizId" element={<QuizUpdate />} />
			</Routes>
			<Footer />
		</React.StrictMode>
	</Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
