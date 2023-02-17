import * as React from 'react';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ height: '32px' }}>
        <Typography
          variant="caption"
          noWrap
          sx={{
            mr: 2,
            fontFamily: 'monospace',
            color: 'inherit',
          }}
        >
          © {new Date().getFullYear()} bolingboling
        </Typography>

        <Typography>
          <a href="https://github.com/zhangxiaoshang/one-minute-dapp" rel="noopener noreferrer" target="_blank">
            <GitHubIcon></GitHubIcon>
          </a>
        </Typography>
      </Stack>
    </Container>
  );
}
