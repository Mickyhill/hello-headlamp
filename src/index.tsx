import {
  registerAppBarAction,
  registerRoute,
  registerSidebarEntry,
} from '@kinvolk/headlamp-plugin/lib';
import { SectionBox } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Button, Typography } from '@mui/material';

function WelcomePage() {
  return (
    <SectionBox title="Welcome">
      <Typography>This page comes from my first Headlamp plugin.</Typography>
    </SectionBox>
  );
}

function HelloButton() {
  const handleClick = () => {
    alert('Hello from my first Headlamp plugin!');
  };

  return (
    <Button
      variant="outlined"
      size="small"
      onClick={handleClick}
      sx={{ color: 'inherit', borderColor: 'inherit', mx: 1 }}
    >
      Say Hello
    </Button>
  );
}

registerAppBarAction(<HelloButton />);

registerSidebarEntry({
  name: 'welcome',
  label: 'Welcome',
  url: '/welcome',
  icon: 'mdi:kubernetes',
});

registerRoute({
  path: '/welcome',
  sidebar: 'welcome',
  name: 'welcome',
  exact: true,
  component: () => <WelcomePage />,
});