import PropTypes from 'prop-types';

import { useBoolean } from 'src/hooks/use-boolean';

import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

export default function LabLayout({ children }) {
  const nav = useBoolean();

  return (
    <>
      <Header onOpenNav={nav.onTrue} />

      <Main>{children}</Main>
    </>
  );
}

LabLayout.propTypes = {
  children: PropTypes.node,
};
