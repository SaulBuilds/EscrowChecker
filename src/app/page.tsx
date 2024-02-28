'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import { escrowABI } from '../utils/abi';
import { contractAddress } from '@/utils/contractAddress';
import { Container, TextField, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { styled } from '@mui/system';
import CustomAppBar from '../../components/CustomAppBar'; // Ensure this path is correct

const CustomBox = styled(Box)({
  marginTop: 2,
  marginBottom: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

interface RawReserveData {
  publicReserved: ethers.BigNumberish;
  coFounderReserved: ethers.BigNumberish;
  price: ethers.BigNumberish;
}

function App() {
  const [inputAddress, setInputAddress] = useState('');
  const account = useAccount();
  const { connect, connectors, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: isWhitelisted } = useReadContract({
    abi: escrowABI,
    address: contractAddress,
    functionName: 'whitelist',
    args: [inputAddress || account.address],
  });

  const { data: rawReserveData } = useReadContract({
    abi: escrowABI,
    address: contractAddress,
    functionName: 'nftReserveAmount',
    args: [inputAddress || account?.address],
  });

  // Define bigNumberReplacer or remove its usage if not needed
  const bigNumberReplacer = (key: string, value: any) => {
    return typeof value === 'bigint' ? value.toString() : value;
  };

  return (
    <Container maxWidth="lg" sx={{ bgcolor: 'black', color: '#ffffff', padding: 1 }}>
      <CustomAppBar connectors={connectors} connect={connect} status={status} error={error} />

      <Card sx={{ bgcolor: 'darkgrey', mb: 2 }}>
        <CardContent>
          <CustomBox>
            <Typography variant="h5" gutterBottom>Account Information</Typography>
            <Typography>Status: {account.status}</Typography>
            <Typography>Addresses: {JSON.stringify(account.addresses)}</Typography>
            <Typography>Chain ID: {account.chainId}</Typography>
            {account.status === 'connected' && (
              <Button variant="contained" onClick={() => disconnect()}>Disconnect</Button>
            )}
          </CustomBox>
        </CardContent>
      </Card>



      <Card sx={{ bgcolor: 'darkgrey', mb: 2 }}>
        <CardContent>
          <CustomBox>
            <Typography variant="h5" gutterBottom>Check Whitelist Status</Typography>
            <TextField
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder="Enter address to check"
              fullWidth
            />
            <Typography>
              {isWhitelisted === undefined && 'Loading...'}
              {isWhitelisted === true && 'Address is whitelisted'}
              {isWhitelisted === false && 'Address is not whitelisted'}
            </Typography>
          </CustomBox>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'darkgrey', mb: 2 }}>
        <CardContent>
          <CustomBox>
            <Typography variant="h5" gutterBottom>Check Reserved Amounts</Typography>
            <Typography>
              {rawReserveData ? (
                <pre>{JSON.stringify(rawReserveData, bigNumberReplacer, 2)}</pre>
              ) : 'Loading...'}
            </Typography>
          </CustomBox>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
