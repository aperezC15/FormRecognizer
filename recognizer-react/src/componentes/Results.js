import React from 'react';
import Tabs from '../componentes/Tabs';
//import Pagina from '../componentes/verPdf';
//import Tabla from './Tabla';

// material-ui
//import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		marginBottom: '4em'
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1)
	}
}));

const Results = () => {
	const classes = useStyles();

	return (
		<div>
			<Tabs />
		</div>
	);
};

export default Results;
