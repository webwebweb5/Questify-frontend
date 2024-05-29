import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import { DateTimePicker } from '@mui/x-date-pickers';

// ----------------------------------------------------------------------

export default function AssignmentNewEditDate() {
  const { control } = useFormContext();

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
