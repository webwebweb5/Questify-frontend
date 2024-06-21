import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Box,
  Stack,
  Table,
  Avatar,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';
import { useCurrentRole } from 'src/hooks/use-current-role';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', minWidth: 180, width: { xs: 300, lg: 450 } },
  { id: 'mail', label: 'Email', align: 'left' },
  { id: 'actions', label: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function MemberList({ users, assignLab = false }) {
  const mdUp = useResponsive('up', 'md');

  const role = useCurrentRole();

  const popover = usePopover();

  const LabVersionSchema = Yup.object().shape({
    labVersion: Yup.string()
      .required('language is required')
      .oneOf(['Java', 'JavaScript', 'Python', 'C'], 'Invalid language'),
  });

  const defaultValues = useMemo(
    () => ({
      labVersion: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(LabVersionSchema),
    defaultValues,
  });

  if (users?.length === 0) {
    return <Box>No User...</Box>;
  }

  return (
    <>
      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.align || 'left'}
                    sx={{
                      backgroundColor: 'transparent',
                      minWidth: headCell.minWidth,
                      // eslint-disable-next-line no-nested-ternary
                      width: headCell.width
                        ? mdUp
                          ? headCell.width.lg
                          : headCell.width.xs
                        : 'auto',
                    }}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {users?.map((user) => (
                <TableRow>
                  <TableCell sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                        }}
                      >
                        {user.firstName_EN.charAt(0)}
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
                        <Typography sx={{ width: 'fit-content' }}>
                          {user.displayName
                            .toLowerCase()
                            .split(' ')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.disabled"
                          sx={{ mt: 0.5, width: 'fit-content' }}
                        >
                          {user.studentId}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="left" sx={{ borderRadius: 0 }}>
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  {role === 'ProfAcc' &&
                    (assignLab ? (
                      <TableCell>
                        <FormProvider methods={methods}>
                          <Stack sx={{ width: 'fit-content', minWidth: 140 }}>
                            <RHFSelect name="labVersion" label="Lab Version">
                              <MenuItem value="v1">Version 1</MenuItem>
                              <MenuItem value="v2">Version 2</MenuItem>
                              <MenuItem value="v3">Version 3</MenuItem>
                            </RHFSelect>
                          </Stack>
                        </FormProvider>
                      </TableCell>
                    ) : (
                      <TableCell align="right">
                        <IconButton onClick={popover.onOpen}>
                          <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
          sx={{ color: 'primary.main' }}
        >
          <Iconify icon="carbon:chart-histogram" />
          Grades
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Remove
        </MenuItem>
      </CustomPopover>
    </>
  );
}

MemberList.propTypes = {
  users: PropTypes.array,
  assignLab: PropTypes.bool,
};
