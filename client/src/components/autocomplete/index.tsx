import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';

interface PlaceAutocompleteInputProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const PlaceAutocompleteInput: React.FC<PlaceAutocompleteInputProps> = ({ onPlaceSelect }) => {
  const [options, setOptions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const service = new google.maps.places.AutocompleteService();

    if (inputValue.length > 2) {
      service.getPlacePredictions({ input: inputValue, types: ['address'] }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setOptions(predictions);
        } else {
          setOptions([]);
        }
      });
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  return (
    <Autocomplete
      id="autocomplete-input"
      options={options}
      getOptionLabel={(option) => option.description}
      onInputChange={(_, value) => setInputValue(value)}
      onChange={(_, value) => {
        if (value) {
          const place = { formatted_address: value.description } as google.maps.places.PlaceResult;
          onPlaceSelect(place);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Address"
          fullWidth
          margin="normal"
          variant="outlined"
        />
      )}
    />
  );
};

export default PlaceAutocompleteInput;
