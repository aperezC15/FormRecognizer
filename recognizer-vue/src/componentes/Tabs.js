import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
//import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import Button from '@material-ui/core/Button';
//import Typography from '@material-ui/core/Typography';
import PicturePDF from '@material-ui/icons/PictureAsPdf';
import Table from '@material-ui/icons/TableChart';
import Divider from '@material-ui/core/Divider';
import Fields from './Fields';
import Pagina from './verPdf';

const useStyles = makeStyles({
	root: {
		width: '100%',
		padding: 5
	},
	bullet: {
		display: 'inline-block',
		margin: '2 2px',
		transform: 'scale(0.8)'
	},
	title: {
		fontSize: 14
	},
	pos: {
		marginBottom: 12,
		marginTop: 12
	}
});

export default function SimpleCard() {
	const classes = useStyles();

	return (
		<Grid container spacing={1}>
			<Grid container justify="center" spacing={3}>
				<Grid item xs={12} lg={6}>
					<Card className={classes.root}>
						<CardContent>
							<PicturePDF />
							<Divider />
							<Pagina />
						</CardContent>
					</Card>
				</Grid>
				<Grid item xs={12} lg={6}>
					<Card className={classes.root}>
						<CardContent>
							<Table />
							<Divider />
							<Fields />
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Grid>
	);
}
