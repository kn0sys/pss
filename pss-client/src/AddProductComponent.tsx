import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function AddProductComponent(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
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
          <TextField
            autoFocus
            required
            margin="dense"
            id="id"
            name="pid"
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
            name="amt"
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
            name="desc"
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
    </React.Fragment>
  );
}

