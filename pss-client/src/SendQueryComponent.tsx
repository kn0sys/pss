import * as React from 'react';
import axios from 'axios';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import { ComputerOutlined } from "@mui/icons-material";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AddProductComponent from './AddProductComponent';
import AppContext from './AppContext';
import AppQuery from './App';

interface Product {
  description: string;
  id: string;
  price: number;
  quantity: string;
}

export default function SendQuery(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowingResponse, setIsShowingResponse] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [notification, setNotification] = React.useState('');
  const [nLevel, setNLevel] = React.useState('');
  const [queryResponse, setQueryResponse] = React.useState<Product>({
    description: "default description",
    id: "id-123",
    price: 0.0,
    quantity: 0,
  });
  const ctx = React.useContext(AppContext);
  
    const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const sendQuery = async (aq: AppQuery) => {
    setIsLoading(true);
    let data = {
	collection: ctx.queryContext.collection,
	query: aq.query,
    }
    let output = null;
    output = await axios({
        method: "post",
        baseURL: `http://localhost:3443/product/nn`,
	data,
    }).catch((error) => {
	setIsLoading(false);
	setNotification(`failed to query valentinus due to: ${error.message}`);
	setNLevel('error');
	setOpenSnackbar(true);
    });
    if (output && output.status == 200) {
      setIsLoading(false);
      setIsShowingResponse(true);
      setNotification('got query result from from valentinus');
      setNLevel('success');
      setOpenSnackbar(true);
      setQueryResponse(output.data);
    }
  }

  const newQuery = () => {
    setIsLoading(false);
    setIsShowingResponse(false);
  }

  return (
    <>
    <AddProductComponent />
    {" "}
    <Button 
      className="pss-button"
      onClick={()=> {sendQuery(props.query)}}
      variant="contained"
      endIcon={<SendIcon />}>
      Send
    </Button>
    {" "}
    {isShowingResponse && !isLoading && (
        <Button 
          onClick={()=> {newQuery()}}
          variant="contained"
          endIcon={<ComputerOutlined />}>
          New Query
        </Button>
      )}
      {isLoading && (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
      <br />
      {isShowingResponse && (
      <Card sx={{ marginTop: "10px", maxWidth: "100%"}}>
      <Box sx={{ display: "flex", justifyContent: "center"}}>
      <CardMedia
        sx={{height: 100, width: 100}}
        image="/assets/factory.png"
        title="default"
      />
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
	{queryResponse.id}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {queryResponse.description}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          price: {queryResponse.price}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          quantity: {queryResponse.quantity}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
      )}
     <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={nLevel}
          variant="filled"
          sx={{ width: '100%' }}
        >
		{notification}
        </Alert>
      </Snackbar>
    </>
  );
}
