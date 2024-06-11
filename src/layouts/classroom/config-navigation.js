import { useMemo } from 'react';
import { useParams } from 'next/navigation';

import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  home: <Iconify icon="carbon:home" sx={{ width: 1, height: 1 }} />,
  classroom: <Iconify icon="fluent:share-screen-person-24-regular" sx={{ width: 1, height: 1 }} />,
  assignment: <Iconify icon="carbon:result" sx={{ width: 1, height: 1 }} />,
  document: <Iconify icon="carbon:document-blank" sx={{ width: 1, height: 1 }} />,
  events: <Iconify icon="carbon:events" sx={{ width: 1, height: 1 }} />,
  charts: <Iconify icon="carbon:chart-histogram" sx={{ width: 1, height: 1 }} />,
};

// ----------------------------------------------------------------------

export function useNavData() {
  const params = useParams();
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'Classroom',
        items: [
          { title: 'General', path: paths.classroom.general(params.cid), icon: ICONS.home },
          {
            title: 'Assignment',
            path: paths.classroom.assignment(params.cid),
            icon: ICONS.assignment,
          },
          { title: 'Members', path: paths.classroom.members(params.cid), icon: ICONS.events },
          { title: 'Grades', path: paths.classroom.grade(params.cid), icon: ICONS.charts },
        ],
      },
    ],
    [params.cid]
  );

  return data;
}
