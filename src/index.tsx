import {
  K8s,
  registerAppBarAction,
  registerDetailsViewSectionsProcessor,
  registerResourceTableColumnsProcessor,
  registerRoute,
  registerSidebarEntry,
} from '@kinvolk/headlamp-plugin/lib';
import {
  ResourceListView,
  ResourceTableColumn,
  SectionBox,
  SimpleTable,
} from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import Pod from '@kinvolk/headlamp-plugin/lib/K8s/pod';
import { Button, Tooltip, Typography } from '@mui/material';

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
      id="hello-headlamp-pods"
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

interface WelcomePageOptions {
  name: string;
  parent: string;
  label: string;
  path: string;
  icon?: string;
  component: () => JSX.Element;
}

// Every page needs a sidebar entry and a route, so one helper registers both.
function registerWelcomePage({ name, parent, label, path, icon, component }: WelcomePageOptions) {
  registerSidebarEntry({ name, url: path, parent, label, icon });
  registerRoute({ path, sidebar: name, name, exact: true, component });
}

registerWelcomePage({
  name: 'welcome',
  parent: '',
  label: 'Welcome',
  path: '/welcome',
  icon: 'mdi:kubernetes',
  component: () => <WelcomePage />,
});

registerWelcomePage({
  name: 'welcome-pods',
  parent: 'welcome',
  label: 'Pods',
  path: '/welcome/pods',
  component: () => <PodsPage />,
});

registerResourceTableColumnsProcessor(function addContainerImagesColumn({ id, columns }) {
  if (id !== 'headlamp-pods') {
    return columns;
  }

  const podColumns = columns as ResourceTableColumn<Pod>[];

  podColumns.push({
    id: 'hello-headlamp-container-images',
    label: 'Container Images',
    getValue: (pod: Pod) => pod.spec.containers.map(c => c.image).join(', '),
    render: (pod: Pod) => {
      const images = pod.spec.containers.map(c => c.image);
      return (
        <Tooltip title={images.join('\n')} placement="bottom-start">
          <Typography noWrap style={{ maxWidth: 240, fontSize: 'inherit' }}>
            {images[0]}
            {images.length > 1 ? ` (+${images.length - 1} more)` : ''}
          </Typography>
        </Tooltip>
      );
    },
  });

  return columns;
});

registerDetailsViewSectionsProcessor(function addContainerResourcesSection(resource, sections) {
  if (!resource || resource.kind !== 'Pod') {
    return sections;
  }

  const sectionId = 'hello-headlamp-container-resources';
  if (sections.some(s => typeof s === 'object' && s !== null && 'id' in s && s.id === sectionId)) {
    return sections;
  }

  const containers = (resource.jsonData?.spec?.containers ?? []).map((c: any) => ({
    name: c.name,
    cpuRequest: c.resources?.requests?.cpu ?? '-',
    cpuLimit: c.resources?.limits?.cpu ?? '-',
    memoryRequest: c.resources?.requests?.memory ?? '-',
    memoryLimit: c.resources?.limits?.memory ?? '-',
  }));

  const newSection = {
    id: sectionId,
    section: (
      <SectionBox title="Container Resources">
        <SimpleTable
          data={containers}
          columns={[
            { label: 'Container', getter: (c: any) => c.name },
            { label: 'CPU Request', getter: (c: any) => c.cpuRequest },
            { label: 'CPU Limit', getter: (c: any) => c.cpuLimit },
            { label: 'Memory Request', getter: (c: any) => c.memoryRequest },
            { label: 'Memory Limit', getter: (c: any) => c.memoryLimit },
          ]}
        />
      </SectionBox>
    ),
  };

  const hasId = (s: (typeof sections)[number]): s is { id: string } =>
    typeof s === 'object' && s !== null && 'id' in s;
  const idx = sections.findIndex(s => hasId(s) && s.id === 'headlamp.pod-containers');

  if (idx === -1) {
    return [...sections, newSection];
  }

  const updated = [...sections];
  updated.splice(idx + 1, 0, newSection);
  return updated;
});