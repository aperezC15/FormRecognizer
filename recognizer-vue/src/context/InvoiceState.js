import React, { useReducer } from 'react';
import InvoiceReducer from './InvoiceReducer';
import { SET_MODELID, SET_FIELDS } from '../types';
import InvoiceContext from './InvoiceContext';

const initialState = {
	modelId: '97637b5e-1261-4a91-b116-76ba81c88b43',
	fields: []
};

const InvoiceState = ({ children }) => {
	const [ state, dispatch ] = useReducer(InvoiceReducer, initialState);

	const setModelId = (id) => {
		dispatch({
			type: SET_MODELID,
			payload: id
		});
	};

	const setAnalysisResult = (result) => {
		//Se solo la primera página ya que el resultado devuelto por el servicio coloca todas las tablas
		//encontradas en el PDF en cada una de las páginas por lo que sería redundante obtener las
		//mismas tablas de todas las páginas.
		const { pages } = result[0];

		const filteredData = result.map((r) => getFilteredFields(r.fields));
		const filteredTables = pages.map((p) => getFilteredTables(p));

		console.log('filterData: ', filteredData);
		console.log('filteredTables: ', filteredTables);

		const completedData = mergeFieldsAndTables(filteredData, filteredTables);
		console.log('datosCompletos', completedData);

		dispatch({
			type: SET_FIELDS,
			payload: completedData
		});
	};

	//clasificar los fields
	function getFilteredFields(fields) {
		const values = getValues(fields);
		return filterValues(values);
	}

	function verificarNombre(value) {
		const expresionNombre = /[A-Z]+,\s[A-Z]+/;
		const expresionNombre2 = /[A-Z]+\s,\s[A-Z]+/;
		//falta la segunda expresion
		return value.match(expresionNombre) || value.match(expresionNombre2);
	}

	function verificarDpi(value) {
		const expresionDpi = /\d{4}\s\d{5}\s\d{4}/;
		return value.match(expresionDpi);
	}

	function getValues(fields) {
		const keys = Object.keys(fields);
		const values = [];

		keys.forEach((k) => values.push(fields[k].value));
		return values;
	}

	function filterValues(values) {
		const votantes = [];
		let dpiActual = null;
		let name = '';
		const numero = /[0-9]+/;
		const letra = /[A-Z]+/;
		let dpimodificado = '';

		values.forEach((v) => {
			const esDpi = verificarDpi(v);
			if (esDpi) {
				let posicionLetra = v.search(letra);

				if (posicionLetra > -1) {
					let espacio = v.indexOf(' ');
					if (espacio > -1) {
						dpimodificado = v.substring(espacio).trim();
					} else {
						dpimodificado = v;
					}
				} else {
					dpimodificado = v;
				}
				if (dpiActual) votantes.push({ dpi: dpiActual, nombre: '' });
				dpiActual = dpimodificado;
				return;
			}

			const esNombre = verificarNombre(v);
			if (esNombre) {
				//debugger;
				let posicionBarras = v.indexOf('*');
				let posicionNumero = v.search(numero);

				if (posicionBarras > -1) {
					name = v.substring(0, posicionBarras).trim();
				} else if (posicionNumero > -1) {
					name = v.substring(0, posicionNumero).trim();
				} else {
					name = v;
				}

				if (dpiActual == null) votantes.push({ dpi: '', nombre: name });
				else {
					votantes.push({ dpi: dpiActual, nombre: name });
					dpiActual = null;
				}
			}
		});

		return votantes;
	}

	//Obtener las filas de cada tabla
	function getFilteredTables({ tables }) {
		let filteredTables = [];

		tables.forEach((t) => {
			const { rows } = t;
			const filtered = getFilteredRows(rows);
			filteredTables = filteredTables.concat(...filtered);
		});
		return filteredTables;
	}

	//Obtener las celdas de cada fila
	function getFilteredRows(rows) {
		let filteredRows = [];

		rows.forEach((r) => {
			const { cells } = r;
			const filtered = getFilteredCells(cells);
			filteredRows = filteredRows.length > 0 ? [ ...filteredRows, ...filtered ] : filtered;
		});

		return filteredRows;
	}

	//Obtener los textos de cada celda
	function getFilteredCells(cells) {
		const filteredCells = cells.map((c) => c.text);
		return filterValues(filteredCells);
	}

	//Combinar los fields y tablas
	const mergeFieldsAndTables = (fields, tables) =>
		fields.map((actual, index) => (actual = [ ...actual, ...tables[index] ]));

	return (
		//retornar
		<InvoiceContext.Provider
			value={{
				modelId: state.modelId,
				fields: state.fields,
				setModelId,
				setAnalysisResult
			}}
		>
			{children}
		</InvoiceContext.Provider>
	);
};

export default InvoiceState;
