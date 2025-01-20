import { Stack, Typography } from '@mui/material';

import { CampaignsPendingEmailsCard } from '@/components/molecules';

export const CampaignsPendingEmails = () => {
  return (
    <Stack gap={3}>
      <Typography variant={'subtitle2'}>Pending Emails (281)</Typography>
      <Stack gap={3}>
        <CampaignsPendingEmailsCard
          avatarName={'R'}
          email={'Shawnmanning@gmail.com'}
          emailContent={
            '<p><span style="font-size:12px"><strong>Elementum varius nisi vel tempus. Donec eleifend egestas viverra.</strong></span></p>' +
            '<p>&nbsp;</p>' +
            '<p><span style="font-size:12px">Hello </span></p>' +
            '<p><span style="font-size:12px">Dear Sir Good Morning, </span></p>' +
            '<p><span style="font-size:12px">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non diam facilisis, commodo libero et, commodo sapien. Pellentesque sollicitudin massa sagittis dolor facilisis, sit amet vulputate nunc molestie. Pellentesque maximus nibh id luctus porta. Ut consectetur dui nec nulla mattis luctus. Donec nisi diam, congue vitae felis at, ullamcorper bibendum tortor. Vestibulum pellentesque felis felis. Etiam ac tortor felis. Ut elit arcu, rhoncus in laoreet vel, gravida sed tortor.</span></p>' +
            '<p><span style="font-size:12px">In elementum varius nisi vel tempus. Donec eleifend egestas viverra. Donec dapibus sollicitudin blandit. Donec scelerisque purus sit amet feugiat efficitur. Quisque feugiat semper sapien vel hendrerit. Mauris lacus felis, consequat nec pellentesque viverra, venenatis a lorem. Sed urna lectus.Quisque feugiat semper sapien vel hendrerit</span></p>'
          }
        />
      </Stack>
    </Stack>
  );
};
