import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import AppContext from './AppContext';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

function getStyles(name: string, collectionName: string[], theme: Theme) {
  return {
    fontWeight: collectionName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

let initCollections = false;
export default function CollectionSelect() {
  const theme = useTheme();
  const [collectionName, setCollectionName] = React.useState<string[]>(['pss_test']);
  const [collectionNames, setCollectionNames] = React.useState<string[]>(['pss_test']);
  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [notification, setNotification] = React.useState('default message');
  const [nLevel, setNLevel] = React.useState('');
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

  const handleChange = (event: SelectChangeEvent<typeof collectionName>) => {
    const {
      target: { value },
    } = event;
    setCollectionName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    ctx.setQueryContext({collection: value, language: ctx.queryContext.language});
  };

  React.useEffect(() => {
    const fetchCollections = async (): Promise<void> => {
      let output = null;
      output = await axios({
        method: "get",
        baseURL: `http://localhost:3443/collections`,
      }).catch((error) => {
	setNotification(`failed to fetch collections: ${error.message}`);
	setNLevel('error');
	setOpenSnackbar(true);
      });
      if (output && output.status == 200) {
        setNotification('got collections from valentinus');
        setNLevel('success');
        setOpenSnackbar(true);
	let views = output.data.collections;
	let cleaned = [];
	views.forEach(c => cleaned.push(c.split('view-')[1]));
	setCollectionNames(cleaned);
      }
    };
    if (!initCollections) { 
    	fetchCollections();
	initCollections = true;
    }
  });

  return (
    <div>
      <FormControl sx={{ marginTop: "10px", width: 500 }}>
        <InputLabel id="collection-name-label">Collection</InputLabel>
        <Select
          labelId="collection-name-label"
          id="collection-name"
	  value={collectionName}
          onChange={handleChange}
          input={<OutlinedInput label="Collection" />}
          MenuProps={MenuProps}
        >
          {collectionNames.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, collectionName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
    </div>
  );
}

