import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AppContext from './AppContext';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

export default function LanguageSelect() {
  const [langCode, setLangCode] = React.useState('en');
  const ctx = React.useContext(AppContext);
  const setLanguage = (language: string) => {
	  ctx.setQueryContext({language, collection: ctx.queryContext.collection});
  }
 
  const handleChange = (event: SelectChangeEvent) => {
    const code = event.target.value as string;
    setLangCode(code);
    setLanguage(code);
  };

  return (
   <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="lang-select-label">Language</InputLabel>
        <Select
          labelId="lang-select-label"
          id="lang-select"
          value={langCode}
	  defaultValue={'en'}
          label="Language"
          onChange={handleChange}
        >
          <MenuItem value={'en'}>English</MenuItem>
	  <MenuItem value={'ja'}>Japanese</MenuItem>
        </Select>
      </FormControl>
    </Box> 
  );
}
