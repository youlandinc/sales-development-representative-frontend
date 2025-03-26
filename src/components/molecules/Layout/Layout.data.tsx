import ICON_SIDE_CAMPAIGNS_DEFAULT from './assets/icon_side_campaigns_default.svg';
import ICON_SIDE_CAMPAIGNS_ACTIVE from './assets/icon_side_campaigns_active.svg';

import ICON_SIDE_LEADS_DEFAULT from './assets/icon_side_leads_default.svg';
import ICON_SIDE_LEADS_ACTIVE from './assets/icon_side_leads_active.svg';

import ICON_SIDE_INBOX_DEFAULT from './assets/icon_side_inbox_default.svg';
import ICON_SIDE_INBOX_ACTIVE from './assets/icon_side_inbox_active.svg';

import ICON_SIDE_LIBRARY_DEFAULT from './assets/icon_side_library_default.svg';
import ICON_SIDE_LIBRARY_ACTIVE from './assets/icon_side_library_active.svg';

import ICON_SIDE_SETTINGS_DEFAULT from './assets/icon_side_settings_default.svg';
import ICON_SIDE_SETTINGS_ACTIVE from './assets/icon_side_settings_active.svg';

import ICON_SIDE_CONTACTS_DEFAULT from './assets/icon_side_contacts_default.svg';
import ICON_SIDE_CONTACTS_ACTIVE from './assets/icon_side_contacts_active.svg';

import ICON_SIDE_CONTACTS_PEOPLE_DEFAULT from './assets/icon_side_contacts_people_default.svg';
import ICON_SIDE_CONTACTS_PEOPLE_ACTIVE from './assets/icon_side_contacts_people_active.svg';

import ICON_SIDE_CONTACTS_COMPANIES_DEFAULT from './assets/icon_side_contacts_companies_default.svg';
import ICON_SIDE_CONTACTS_COMPANIES_ACTIVE from './assets/icon_side_contacts_companies_active.svg';

import ICON_SIDE_CONTACTS_LISTS_DEFAULT from './assets/icon_side_contacts_lists_default.svg';
import ICON_SIDE_CONTACTS_LISTS_ACTIVE from './assets/icon_side_contacts_lists_active.svg';

export const LAYOUT_SIDE_MENU = [
  {
    label: 'Campaigns',
    url: '/campaigns',
    key: 'campaigns',
    defaultIcon: ICON_SIDE_CAMPAIGNS_DEFAULT,
    activeIcon: ICON_SIDE_CAMPAIGNS_ACTIVE,
    type: 'link',
  },
  {
    label: 'Contacts',
    key: 'Contacts',
    defaultIcon: ICON_SIDE_CONTACTS_DEFAULT,
    activeIcon: ICON_SIDE_CONTACTS_ACTIVE,
    type: 'link',
    subMenus: [
      {
        label: 'People',
        url: '/contacts/people',
        key: 'people',
        defaultIcon: ICON_SIDE_CONTACTS_PEOPLE_DEFAULT,
        activeIcon: ICON_SIDE_CONTACTS_PEOPLE_ACTIVE,
        type: 'link',
      },
      {
        label: 'Companies',
        url: '/contacts/companies',
        key: 'companies',
        defaultIcon: ICON_SIDE_CONTACTS_COMPANIES_DEFAULT,
        activeIcon: ICON_SIDE_CONTACTS_COMPANIES_ACTIVE,
        type: 'link',
      },
      {
        label: 'Lists',
        url: '/contacts/lists',
        key: 'lists',
        defaultIcon: ICON_SIDE_CONTACTS_LISTS_DEFAULT,
        activeIcon: ICON_SIDE_CONTACTS_LISTS_ACTIVE,
        type: 'link',
      },
    ],
  },
  {
    label: 'Leads',
    url: '/leads',
    key: 'leads',
    defaultIcon: ICON_SIDE_LEADS_DEFAULT,
    activeIcon: ICON_SIDE_LEADS_ACTIVE,
    type: 'link',
  },
  {
    label: 'Inbox',
    url: '/inbox',
    key: 'inbox',
    defaultIcon: ICON_SIDE_INBOX_DEFAULT,
    activeIcon: ICON_SIDE_INBOX_ACTIVE,
    type: 'link',
  },
  {
    label: 'Library',
    url: '/library',
    key: 'library',
    defaultIcon: ICON_SIDE_LIBRARY_DEFAULT,
    activeIcon: ICON_SIDE_LIBRARY_ACTIVE,
    type: 'link',
  },
  {
    label: 'Settings',
    url: '/settings',
    key: 'settings',
    defaultIcon: ICON_SIDE_SETTINGS_DEFAULT,
    activeIcon: ICON_SIDE_SETTINGS_ACTIVE,
    type: 'link',
  },
];
