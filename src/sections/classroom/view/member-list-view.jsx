'use client';

import { useSnackbar } from 'notistack';
import { useParams } from 'next/navigation';

import {
  Box,
  Stack,
  Table,
  Button,
  Avatar,
  Tooltip,
  TableRow,
  MenuItem,
  Container,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';
import { useCurrentRole } from 'src/hooks/use-current-role';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { useGetClassroomById } from 'src/api/classroom';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import MemberList from '../member-list';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', minWidth: 180, width: { xs: 300, lg: 450 } },
  { id: 'mail', label: 'Email', align: 'left' },
  { id: 'actions', label: '', align: 'right' },
];

export default function MemberListView() {
  const settings = useSettingsContext();

  const mdUp = useResponsive('up', 'md');

  const role = useCurrentRole();

  const popover = usePopover();

  const params = useParams();

  const { classroom } = useGetClassroomById(params.cid);

  const { copy } = useCopyToClipboard();

  const { enqueueSnackbar } = useSnackbar();

  const onCopy = (invitationCode) => {
    if (invitationCode) {
      enqueueSnackbar(`Copied: ${invitationCode}`);
      copy(invitationCode);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={2} sx={{ mb: 6 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Typography variant="h4">Professors</Typography>
            <Label>1</Label>
          </Stack>

          <Tooltip title="Invitation Code" placement="top" arrow>
            <Button
              startIcon={<Iconify icon="carbon:copy" />}
              sx={{ px: 1.5 }}
              onClick={() => onCopy(classroom?.invitationCode)}
            >
              {classroom?.invitationCode}
            </Button>
          </Tooltip>
        </Stack>

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
                <TableRow>
                  <TableCell sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        alt={classroom?.professor?.firstName_EN}
                        sx={{
                          width: 36,
                          height: 36,
                        }}
                      >
                        {classroom?.professor?.firstName_EN?.charAt(0)}
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
                        <Typography sx={{ width: 'fit-content' }}>
                          {classroom?.professor?.displayName
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
                          {classroom?.professor?.professorId}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="left" sx={{ borderRadius: 0 }}>
                    <Typography>{classroom?.professor?.email}</Typography>
                  </TableCell>
                  {role === 'ProfAcc' && (
                    <TableCell
                      align="right"
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    >
                      <IconButton onClick={popover.onOpen}>
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Stack>

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

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Typography variant="h4">Students</Typography>
            <Label>{classroom?.students?.length}</Label>
          </Stack>
        </Stack>

        <MemberList users={classroom?.students} />
      </Stack>
    </Container>
  );
}
