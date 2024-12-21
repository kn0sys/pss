import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';

interface AddProductRequest {
  description: string,
  id: string,
  price: number,
  quantity: number,
}

export default function AddProductComponent(props) {
  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [notification, setNotification] = React.useState('default message');
  const [nLevel, setNLevel] = React.useState('');
  // bad design i know, move collection to a separate state later...sorry
  const [reqAddProduct, setAddProductRequest] = React.useState<AddProductRequest>({
    collection: "",
    description: "",
    id: "",
    price: 0,
    quantity: 0,
  })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleChange =
    (prop: keyof AddProductRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAddProductRequest({ [prop]: event.target.value });
      // override string back to number
      const newReq: AddProductRequest = {
	      price: parseInt(reqAddProductRequest.price, 10),
	      quantity: parseInt(reqAddProductRequest.quantity, 10),
	      ...reqAddProductRequest,
      }
      setAddProductRequest(newReq);
  }

  const addProduct = async (ap: AddProductRequest): Promise<void> => {
    let output = null;
      console.log('send axios request')
      output = await axios({
        method: "post",
        baseURL: `http://localhost:3443/product/${ap.collection}`,
        data: ap,
      }).catch((error) => {
	setNotification(`failed to add product: ${error.message}`);
	setNLevel('error');
	setOpenSnackbar(true);
      });
    if (output && output.status == 200) {
      setNotification('product added successfully');
      setNLevel('success');
      setOpenSnackbar(true);
    }
    handleClose();
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} endIcon={<AddCircleOutlineIcon />}>
        Add Product
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
	    event.preventDefault();
            const formData = new FormData(event.currentTarget);
            let formJson = Object.fromEntries((formData as AddProductRequest).entries());
	    formJson.price = parseFloat(formJson.price);
	    formJson.quantity = parseInt(formJson.quantity, 10);
	    console.log(formJson);
            addProduct(formJson);
          },
        }}
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a product enter a collection (group of related products, alphanumerics only with no spaces),
	    unique id [name]-[serial number], quantity, amount in dollars (0.0)
	    and description (Currently ENGLISH ONLY for vector search).
          </DialogContentText>
	  <DialogContentText>
  		製品を追加するには、コレクション（関連製品のグループ、スペースなしの英数字のみ）、
		一意の ID [名前]-[シリアル番号]、数量、ドルでの金額（0.0）、および説明（現在、ベクター検索では英語のみ）を入力します。
  	  </ DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="id"
            name="id"
            label="Product ID (識別)"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="qtyId"
            name="quantity"
            label="Quantity (量)"
            type="number"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="amount"
            name="price"
            label="Amount (価額)"
            type="currency"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="description"
            name="description"
            label="Description (価額)"
            type="text"
            fullWidth
            variant="standard"
          />
	  <TextField
	    autoFocus
	    required
	    margin="dense"
	    id="collection"
	    name="collection"
	    label="Collection Name (コレクション名)"
	    type="text"
	    fullWidth
	    variant="standard"
	  />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
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
    </React.Fragment>
  );
}

