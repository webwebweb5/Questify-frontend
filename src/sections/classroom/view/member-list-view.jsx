'use client';

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

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={2} sx={{ mb: 6 }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">Professors</Typography>

          <Tooltip title="Invitation Code" placement="top" arrow>
            <Button startIcon={<Iconify icon="carbon:copy" />} sx={{ px: 1.5 }}>
              748e2408
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
                        sx={{
                          width: 36,
                          height: 36,
                        }}
                      >
                        P
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
                        <Typography sx={{ width: 'fit-content' }}>Pathathai Nalumpoon</Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.disabled"
                          sx={{ mt: 0.5, width: 'fit-content' }}
                        >
                          542118024
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="left" sx={{ borderRadius: 0 }}>
                    <Typography>pathathai.n@cmu.ac.th</Typography>
                  </TableCell>
                  {role === 'ProfAcc' && (
                    <TableCell
                      align="right"
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    >
                      <IconButton>
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
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Remove
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
          sx={{ color: 'primary.main' }}
        >
          <Iconify icon="carbon:chart-histogram" />
          Grades
        </MenuItem>
      </CustomPopover>

      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">Students</Typography>
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
                        sx={{
                          width: 36,
                          height: 36,
                        }}
                      >
                        P
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
                        <Typography sx={{ width: 'fit-content' }}>
                          Phiriyakorn Maneekongrit
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.disabled"
                          sx={{ mt: 0.5, width: 'fit-content' }}
                        >
                          642115031
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="left" sx={{ borderRadius: 0 }}>
                    <Typography>phiriyakorn_m@cmu.ac.th</Typography>
                  </TableCell>
                  {role === 'ProfAcc' && (
                    <TableCell
                      align="right"
                      sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                    >
                      <IconButton>
                        <Iconify icon="eva:more-vertical-fill" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                        }}
                      >
                        S
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
                        <Typography sx={{ width: 'fit-content' }}>
                          Sorawee Sripakdeepongdej
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.disabled"
                          sx={{ mt: 0.5, width: 'fit-content' }}
                        >
                          642115045
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="left" sx={{ borderRadius: 0 }}>
                    <Typography>sorawee_sri@cmu.ac.th</Typography>
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
    </Container>
  );
}
