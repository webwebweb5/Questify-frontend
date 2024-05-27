'use client';

import PropTypes from 'prop-types';

import LabLayout from 'src/layouts/lab';
import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <AuthGuard>
      <LabLayout>{children}</LabLayout>
    </AuthGuard>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
