import { PluginSettingsDetailsProps } from '@kinvolk/headlamp-plugin/lib';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';
import { DEFAULT_CONFIG } from './config';

export default function HelloHeadlampSettings({ data, onDataChange }: PluginSettingsDetailsProps) {
  const config = { ...DEFAULT_CONFIG, ...data };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Pod Detail Page
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={config.showContainerResources}
            onChange={event =>
              onDataChange?.({ ...config, showContainerResources: event.target.checked })
            }
          />
        }
        label="Show Container Resources section"
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        When on, each Pod detail page shows a table of CPU and memory requests and limits.
      </Typography>
    </Box>
  );
}