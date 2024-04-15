import React, { useEffect } from 'react';
import axiosInstance from '../axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
	const history = useNavigate();

	useEffect(() => {
		axiosInstance.post('user/logout/blacklist/', {
			refresh_token: localStorage.getItem('refresh_token'),
		});
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		window.dispatchEvent(new Event("storage"));
		axiosInstance.defaults.headers['Authorization'] = null;
		history('/login');
	}, [history]);
	return <div>Logout</div>;
}
