import PropTypes from 'prop-types';

import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { fDateTime } from 'src/utils/format-time';

import Scrollbar from 'src/components/scrollbar';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', minWidth: 180, width: { xs: 300, lg: 450 } },
  { id: 'due', label: 'Due' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'score', label: 'Score' },
];

// ----------------------------------------------------------------------

export default function GradeListStudent({ assignments }) {
  const mdUp = useResponsive('up', 'md');

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
                    <Typography sx={{ width: 'fit-content' }}>{assignment.title}</Typography>
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
                  <Typography variant="body2">{fDateTime(assignment.endTime)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{fDateTime(assignment.endTime)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">0/100</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}

GradeListStudent.propTypes = {
  assignments: PropTypes.array,
};
