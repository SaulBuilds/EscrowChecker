import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useReadContract } from 'wagmi';
import { contractAddress } from '@/utils/contractAddress';
import { escrowABI } from '@/utils/abi';

interface ReserveData {
  userAddress: string;
  publicReserved: string;
  coFounderReserved: string;
  price: string;
  whitelisted: boolean;
}

const [inputAddress, setInputAddress] = useState('');

const reserveData = useReadContract({
    abi: escrowABI,
    address: contractAddress,
    functionName: 'nftReserveAmount',
    args: [inputAddress],
  });

  const whitelisted = useReadContract({
    abi: escrowABI,
    address: contractAddress,
    functionName: 'whitelist',
    args: [inputAddress],
  });

function useReadEscrow(addresses: string[]): ReserveData[] {
  const [data, setData] = useState<ReserveData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Initialize an empty array for the results
      const results: ReserveData[] = [];

      for (let address of addresses) {

        const dataObject: ReserveData = {
            userAddress: address,
            publicReserved: reserveData?.data ? ethers.formatUnits((reserveData.data as ReserveData).publicReserved, 'wei') : 'N/A',
            coFounderReserved: reserveData?.data ? ethers.formatUnits((reserveData.data as ReserveData).coFounderReserved, 'wei') : 'N/A',
            price: reserveData?.data ? ethers.formatEther((reserveData.data as ReserveData).price) : 'N/A',
            whitelisted: !!whitelisted,
        };

        results.push(dataObject);
      }

      setData(results);
    };

    fetchData();
  }, [addresses]);

  return data;
}

export default useReadEscrow;