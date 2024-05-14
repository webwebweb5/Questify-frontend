import { Controller, useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// ----------------------------------------------------------------------

export default function AssignmentNewEditDate() {
  const { control } = useFormContext();

  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
      <Controller
        name="startDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
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
        name="dueDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
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
