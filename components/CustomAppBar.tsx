
import React from 'react';
import { AppBar, Button, Typography, Toolbar } from '@mui/material';
import { Connector } from 'wagmi';

interface CustomAppBarProps {
    connectors: readonly Connector[]; // Adjusted to readonly
    connect: (options: { connector: Connector }) => void;
    status: string;
    error: { message: string } | null;
  }
  
  const CustomAppBar: React.FC<CustomAppBarProps> = ({ connectors, connect, status, error }) => {
    return (
      <AppBar position="static" sx={{ backgroundColor:'#FF7023',maxHeight: 80 }}>
        <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Forge Escrow Checker
          </Typography>
          {connectors.map((connector) => (
            <Button key={connector.id} onClick={() => connect({ connector })} sx={{ color: '#FFFFFF' }}>
              {connector.name}
            </Button>
          ))}
          <Typography>{status}</Typography>
          {error && <Typography>{error.message}</Typography>}
        </Toolbar>
      </AppBar>
    );
  };
  
  export default CustomAppBar;