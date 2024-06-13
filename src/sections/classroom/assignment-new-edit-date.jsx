import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export default function AssignmentNewEditDate({ disableStartTime }) {
  const { control } = useFormContext();

  const theme = useTheme();

  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
      <Controller
        name="startTime"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DateTimePicker
            label="Start Date"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            disablePast
            disabled={disableStartTime}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: disableStartTime
                  ? 'Start time cannot be changed when the assignment is already started'
                  : error?.message,
                sx: {
                  '& .MuiFormHelperText-root': {
                    color: disableStartTime ? theme.palette.warning.main : theme.palette.error.main,
                  },
                },
              },
            }}
          />
        )}
      />

      <Controller
        name="endTime"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DateTimePicker
            label="Due date"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            disablePast
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
          />
        )}
      />
    </Stack>
  );
}

AssignmentNewEditDate.propTypes = {
  disableStartTime: PropTypes.bool,
};
