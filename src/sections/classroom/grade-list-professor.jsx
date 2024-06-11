import PropTypes from 'prop-types';
import { useParams, useRouter } from 'next/navigation';

import {
  Box,
  Link,
  Table,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TextMaxLine from 'src/components/text-max-line';
import EmptyContent from 'src/components/empty-content';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', minWidth: 180, width: { xs: 300, lg: 450 } },
  { id: 'due', label: 'Due' },
  { id: 'submission', label: 'Submission' },
  { id: 'actions', label: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function GradeListProfessor({ assignments }) {
  const mdUp = useResponsive('up', 'md');

  const popover = usePopover();

  const params = useParams();

  const router = useRouter();

  if (assignments.length === 0) {
    return <EmptyContent filled title="No Data" sx={{ my: 3, py: 10 }} />;
  }

  return (
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
                    width: headCell.width ? (mdUp ? headCell.width.lg : headCell.width.xs) : 'auto',
                  }}
                >
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.assignmentId}>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
                    <Link
                      color="inherit"
                      component={RouterLink}
                      href={paths.classroom.assignmentId(
                        assignment.classroom.classroomId,
                        assignment.assignmentId
                      )}
                    >
                      <TextMaxLine line={1}>{assignment.title}</TextMaxLine>
                    </Link>
                    <Typography
                      component="span"
                      variant="caption"
                      color="text.disabled"
                      sx={{ mt: 0.5, width: 'fit-content' }}
                    >
                      By {assignment.professor.professorId}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{fDateTime(assignment.startTime)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">0/2</Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={popover.onOpen}>
                    <Iconify icon="eva:more-vertical-fill" />
                  </IconButton>
                </TableCell>
                <CustomPopover
                  open={popover.open}
                  onClose={popover.onClose}
                  arrow="right-top"
                  sx={{ width: 140, boxShadow: 'none' }}
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
                      router.push(
                        paths.classroom.assignmentEdit(
                          assignment.classroom.classroomId,
                          assignment.assignmentId
                        )
                      );
                    }}
                  >
                    <Iconify icon="solar:pen-bold" />
                    Edit
                  </MenuItem>
                </CustomPopover>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}

GradeListProfessor.propTypes = {
  assignments: PropTypes.array,
};
