import {
  K8s,
  registerAppBarAction,
  registerRoute,
  registerSidebarEntry,
} from '@kinvolk/headlamp-plugin/lib';
import {
  ResourceListView,
  SectionBox,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Button, Typography } from '@mui/material';

function WelcomePage() {
  const [nodes, nodesError] = K8s.ResourceClasses.Node.useList();

  if (!nodes && !nodesError) {
    return (
      <SectionBox title="Welcome">
        <Typography>Loading nodes...</Typography>
      </SectionBox>
    );
  }

  if (nodesError || !nodes) {
    return (
      <SectionBox title="Welcome">
        <Typography>Could not load nodes: {String(nodesError)}</Typography>
      </SectionBox>
    );
  }

  return (
    <SectionBox title="Welcome">
      <Typography>This cluster has {nodes.length} node(s).</Typography>
      {nodes.map(node => (
        <Typography key={node.metadata.name}>
          {node.metadata.name}: kubelet {node.jsonData.status?.nodeInfo?.kubeletVersion}
        </Typography>
      ))}
    </SectionBox>
  );
}

function PodsPage() {
  return (
    <ResourceListView
      title="Pods"
      resourceClass={K8s.ResourceClasses.Pod}
      columns={[
        'name',
        'namespace',
        {
          id: 'phase',
          label: 'Phase',
          getValue: (pod: any) => pod.jsonData.status?.phase ?? '-',
        },
        'age',
      ]}
    />
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

registerSidebarEntry({
  parent: 'welcome',
  name: 'welcome-pods',
  label: 'Pods',
  url: '/welcome/pods',
});

registerRoute({
  path: '/welcome',
  sidebar: 'welcome',
  name: 'welcome',
  exact: true,
  component: () => <WelcomePage />,
});

registerRoute({
  path: '/welcome/pods',
  sidebar: 'welcome-pods',
  name: 'welcome-pods',
  exact: true,
  component: () => <PodsPage />,
});