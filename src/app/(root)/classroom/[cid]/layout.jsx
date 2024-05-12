'use client';

import PropTypes from 'prop-types';

import ClassroomLayout from 'src/layouts/classroom';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return <ClassroomLayout>{children}</ClassroomLayout>;
}

Layout.propTypes = {
  children: PropTypes.node,
};
