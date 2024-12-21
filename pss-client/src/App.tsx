import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ComputerOutlined } from "@mui/icons-material";
import axios from "axios";
import "./App.css";
import logo from './assets/machine-learning-icon-vector.jpg';
import { Box, Container, CssBaseline } from "@mui/material";
import Paper from '@mui/material/Paper';
import AddProductComponent from './AddProductComponent';


// combo box for collections list
// combo box for language
// card for query response
// integrate nn query api
// integrate translation api

function App() {
  interface GptRequest {
    query: string;
  }
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowingResponse, setIsShowingResponse] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [query, setQuery] = React.useState<GptRequest>({
    query: "",
  });
  const [response, setResponse] = React.useState('');
  const [error, setError] = React.useState('');
  const [openAddProduct, setOpenAddProduct] = React.useState(false);

  const newQuery = () => {
    setIsLoading(false);
    setIsShowingResponse(false);
    setResponse('');
    setIsError(false);
    setError('');
  }

  const handleChange =
    (prop: keyof GptRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery({ [prop]: event.target.value });
    };
  
  const sendQuery = async (qr: GptRequest): Promise<void> => {
    setIsLoading(true);
    let output = null;
    try {
      output = await axios({
        method: "post",
        baseURL: `https://hiahatf.org/api`,
        data: qr,
      });
    } catch {
      setIsLoading(false);
      setIsError(true);
      setError('Error: failed to query model.');
    }
    if (output) {
      setIsLoading(false);
      setIsShowingResponse(true);
      setResponse(output.data.response);
    }
    if (!output) {
      setIsLoading(false);
    }
  };

  return (
    <>
    {!isLoading && (
      <img src={logo} width={100} alt="Logo" />
    )}
    {isLoading && (
          <CircularProgress />
    )}
    <br/>
      {!isShowingResponse && (
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
          </CssBaseline>
        </Container>
      )}
      <br />
      {(!isShowingResponse && !isError) && !isLoading && (
        <>
	<AddProductComponent />
	{" "}
	<Button 
	  className="pss-button"
          onClick={()=> {sendQuery(query)}}
          variant="contained"
          endIcon={<SendIcon />}>
          Send
        </Button>
	</>
      )}
      {(isShowingResponse || isError) && !isLoading && (
        <Button 
          onClick={()=> {newQuery()}}
          variant="contained"
          endIcon={<ComputerOutlined />}>
          New Query
        </Button>
      )}
      <br />
      {isLoading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
      <br/>
      <p className="response">{response}</p>
      <p className="response">{error}</p>
      {/* <Paper elevation={12}>test</Paper> */}
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
