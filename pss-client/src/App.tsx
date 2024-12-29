import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ComputerOutlined } from "@mui/icons-material";
import axios from "axios";
import "./App.css";
import logo from './assets/machine-learning-icon-vector.jpg';
import { Box, Container, CssBaseline } from "@mui/material";
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import AddProductComponent from './AddProductComponent';
import LanguageSelectionComponent from './LanguageSelectionComponent';
import CollectionSelectionComponent from './CollectionSelectionComponent';
import SendQuery from './SendQueryComponent';
import AppContext from './AppContext';

export interface AppQuery {
  query: string
}

// card for query response
// integrate nn query api
// integrate translation api

function App() {

  interface QueryContext {
    collection: string;
    language: string;
  }

  /* global query context to set values from the combo/text boxes*/
  const [queryContext, setQueryContext] = React.useState<QueryContext>({
    collection: "pss_test",
    language: "en",
  })
  /* update the global query context for setting the collection and language*/
  const configQueryContext = (qc: QueryContext) => {
    setQueryContext(qc);
  }
  const queryContextContainer = {
	  queryContext: queryContext,
	  setQueryContext: setQueryContext,
  }
  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowingResponse, setIsShowingResponse] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [query, setQuery] = React.useState<AppQuery>({
    query: "",
  });
  const [response, setResponse] = React.useState('');
  const [error, setError] = React.useState('');
  const [openAddProduct, setOpenAddProduct] = React.useState(false);
  const ctx = React.useContext(AppContext);

  const handleChange =
    (prop: keyof AppQuery) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery({ [prop]: event.target.value });
    };
  
  return (
    <>
    <img src={logo} width={100} alt="Logo" />
    <br/>
        <Container maxWidth="lg">
          <CssBaseline>
          <Box sx={{ width: 500, maxWidth: "100%"}}>
          <TextField
            fullWidth
            label="query"
            id="fullWidth"
            onChange={handleChange("query")}
            placeholder="What is water made of?"
          />
          </Box>
	  <AppContext.Provider value={queryContextContainer}>
	  <Box sx={{ marginTop: "10px", width: 500, maxWidth: "100%"}}>  
	    <LanguageSelectionComponent />
	    <CollectionSelectionComponent />
	  <br />
	  <SendQuery query={query} />
	  </ Box>
	  </ AppContext.Provider>
          </CssBaseline>
        </Container>
      <br/>
        <div className="links">
        <p>
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/kn0sys">n12n</a> {' '}
          <a target="_blank" rel="noopener noreferrer" href="https://github.com/hyahatiph-labs">archive</a> {' '}
          <a target="_blank" rel="noopener noreferrer" href="https://hiahatf.org/arch.pdf">architecture</a> {'   '}
        </p>
        </div>
    </>
  );
}

export default App;
