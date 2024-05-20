import { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'next/navigation';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { _labMD } from 'src/_mock/_labMarkdown';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';

import LabItem from './view/lab-item';

// ----------------------------------------------------------------------

export default function LabList({ labs }) {
  const params = useParams();

  const [popupOpen, setPopupOpen] = useState(false);

  if (labs.length === 0) {
    return <EmptyContent filled title="No Data" sx={{ my: 3, py: 10 }} />;
  }

  const renderDialog = (
    <Dialog fullWidth maxWidth="sm" open={popupOpen} onClose={() => setPopupOpen(false)}>
      <DialogTitle id="crop-dialog-title">Lab Information</DialogTitle>
      <DialogContent dividers style={{ position: 'relative' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Two Sum
        </Typography>
        <Markdown children={_labMD} />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setPopupOpen(false)}
          startIcon={<Iconify icon="eva:close-outline" />}
        >
          Close
        </Button>
        <LoadingButton
          color="primary"
          variant="contained"
          // onClick=""
          startIcon={<Iconify icon="carbon:play-filled-alt" />}
          // loading={loading.value}
        >
          Start Lab
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        sx={{ my: 5 }}
      >
        {labs.map((lab) => (
          <LabItem key={lab.id} lab={lab} setPopupOpen={setPopupOpen} />
        ))}
      </Box>

      <Button
        variant="contained"
        sx={{ py: 1.5, mr: 2 }}
        href={paths.classroom.LabNew(params.cid, params.aid)}
      >
        Add New Lab (Manual)
      </Button>
      <Button variant="contained" color="primary" sx={{ py: 1.5 }}>
        Add New Lab (AI gen)
      </Button>

      {renderDialog}
    </>
  );
}

LabList.propTypes = {
  labs: PropTypes.array,
};
