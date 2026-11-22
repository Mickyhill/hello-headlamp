import { ApiProxy, K8s } from '@kinvolk/headlamp-plugin/lib';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type Status = 'checking' | 'yes' | 'no';

// Same idea as checkAPIGroup in the Kyverno plugin: ask the API server for the group.
async function apiGroupExists(path: string): Promise<boolean> {
  try {
    await ApiProxy.request(path, { method: 'GET' });
    return true;
  } catch {
    return false;
  }
}

function useApiGroup(path: string): Status {
  const cluster = K8s.useCluster();
  const [status, setStatus] = useState<Status>('checking');

  useEffect(() => {
    let cancelled = false;
    setStatus('checking');
    apiGroupExists(path).then(found => {
      if (!cancelled) {
        setStatus(found ? 'yes' : 'no');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [cluster, path]);

  return status;
}

function label(status: Status): string {
  if (status === 'checking') {
    return 'checking...';
  }
  return status === 'yes' ? 'yes' : 'no';
}

export default function ApiGroupStatus() {
  const kyverno = useApiGroup('/apis/kyverno.io/v1');
  const apps = useApiGroup('/apis/apps/v1');

  return (
    <>
      <Typography>Kyverno installed: {label(kyverno)}</Typography>
      <Typography>Apps API available: {label(apps)}</Typography>
    </>
  );
}