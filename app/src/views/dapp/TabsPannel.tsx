import { Dispatch, SetStateAction } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface PannelTabsProps {
  tab: TabName;
  setTab: Dispatch<SetStateAction<TabName>>;
}

export enum TabName {
  read = 'read',
  write = 'write',
}

export function TabsPannel(props: PannelTabsProps) {
  const { tab, setTab } = props;

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button variant={tab === TabName.read ? 'contained' : 'outlined'} onClick={() => setTab(TabName.read)}>
        Read Contract
      </Button>
      <Button variant={tab === TabName.write ? 'contained' : 'outlined'} onClick={() => setTab(TabName.write)}>
        Write Contract
      </Button>
    </Stack>
  );
}
