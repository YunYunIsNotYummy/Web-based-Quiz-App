import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useNavigate, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	cardMedia: {
		paddingTop: '56.25%', // 16:9
	},
	link: {
		margin: theme.spacing(1, 1.5),
	},
	cardHeader: {
		backgroundColor:
			theme.palette.type === 'light'
				? theme.palette.grey[200]
				: theme.palette.grey[700],
	},
	postTitle: {
		fontSize: '16px',
		textAlign: 'left',
	},
	postText: {
		display: 'flex',
		justifyContent: 'left',
		alignItems: 'baseline',
		fontSize: '12px',
		textAlign: 'left',
		marginBottom: theme.spacing(2),
	},
	levelText: {
		display: 'flex',
		justifyContent: 'left',
		alignItems: 'baseline',
		fontSize: '8px',
		textAlign: 'right',
		marginBottom: theme.spacing(2),
	},
}));

const Posts = (props) => {
	
	const { posts } = props;
	const navi = useNavigate()
	const location = useLocation();

	const handleCardClick = (quiz) => {
		console.log(location.pathname)
		if (location.pathname.startsWith('/user')){
			navi(`/quiz/update/${quiz}/`)
		}else{
			navi(`/quiz/${quiz}`)
		}
	};
	const classes = useStyles();

	if (!posts || posts.length === 0) return <p>Can not find any posts, sorry</p>;
	return (
		<React.Fragment>
			<Container maxWidth="md" component="main">
				<Grid container spacing={5} alignItems="flex-end">
					{posts.map((post) => {
						return (
							// Enterprise card is full width at sm breakpoint
							<Grid item key={post.id} xs={12} md={4}>
								<Card className={classes.card} onClick={() => handleCardClick(post.id)}>
									<CardMedia
										className={classes.cardMedia}
										image="https://source.unsplash.com/random"
										title="Image title"
									/>
									<CardContent className={classes.cardContent}>
										<Typography
											gutterBottom
											variant="h6"
											component="h2"
											className={classes.postTitle}
										>
											{post.title.substr(0, 50)}...
										</Typography>
										<div className={classes.levelText}>
											<Typography color="textSecondary">
												Level - {post.level.charAt(0).toUpperCase() + post.level.slice(1)}
											</Typography>
										</div>
										<div className={classes.levelText}>
											<Typography color="textSecondary">
												Status - {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
											</Typography>
										</div>
									</CardContent>
								</Card>
							</Grid>
						);
					})}
				</Grid>
			</Container>
		</React.Fragment>
	);
};
export default Posts;
