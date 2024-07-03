'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from '~~/hooks/scaffold-eth';
import { notification } from '~~/utils/scaffold-eth';

const VotePage = () => {
    const { address, isDisconnected } = useAccount();
    const { connect, connectors } = useConnect();
    const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    // 계약 정보 가져오기
    const { data: votingContractInfo, isLoading: isLoadingContractInfo } = useDeployedContractInfo('Voting');
    const votingContractAddress = votingContractInfo?.address;
    const votingContractAbi = votingContractInfo?.abi;

    useEffect(() => {
        console.log("Voting Contract Info:", votingContractInfo);
    }, [votingContractInfo]);

    // 후보자 리스트 가져오기
    const { data: candidates, isLoading: isLoadingCandidates, refetch: refetchCandidates } = useScaffoldReadContract({
        contractName: 'Voting',
        functionName: 'getCandidates',
    });

    // 사용자 투표 상태 가져오기
    const { data: voterStatus, isLoading: isLoadingVoterStatus, refetch: refetchVoterStatus } = useScaffoldReadContract({
        contractName: 'Voting',
        functionName: 'voters',
        args: [address],
    });

    // 배포자 주소 가져오기
    const { data: ownerAddress, isLoading: isLoadingOwnerAddress } = useScaffoldReadContract({
        contractName: 'Voting',
        functionName: 'owner',
    });

    useEffect(() => {
        if (voterStatus !== undefined) {
            setHasVoted(voterStatus);
        }
        if (ownerAddress !== undefined) {
            setIsOwner(address === ownerAddress);
        }
    }, [voterStatus, ownerAddress, address]);

    const { writeContractAsync: vote, isMining, error: txError } = useScaffoldWriteContract('Voting');
    const { writeContractAsync: resetVotes, isMining: isResetting, error: resetError } = useScaffoldWriteContract('Voting');

    const handleVote = async () => {
        if (vote && selectedCandidate !== null) {
            try {
                await vote({
                    abi: votingContractAbi,
                    address: votingContractAddress,
                    functionName: 'vote',
                    args: [selectedCandidate],
                });
                notification.success('Vote submitted successfully!');
                await refetchVoterStatus();
                await refetchCandidates();
                setHasVoted(true);
            } catch (error) {
                console.error('Error while voting:', error);
                notification.error('Error while submitting vote.');
            }
        } else {
            console.error('vote function is not available or candidate not selected');
        }
    };

    const handleReset = async () => {
        if (resetVotes) {
            try {
                await resetVotes({
                    abi: votingContractAbi,
                    address: votingContractAddress,
                    functionName: 'resetVotes',
                });
                notification.success('Votes reset successfully!');
                await refetchVoterStatus();
                await refetchCandidates();
            } catch (error) {
                console.error('Error while resetting votes:', error);
                notification.error('Error while resetting votes.');
            }
        } else {
            console.error('resetVotes function is not available');
        }
    };

    if (isLoadingContractInfo || isLoadingCandidates || isLoadingVoterStatus || isLoadingOwnerAddress) {
        return <div className="flex items-center justify-center h-screen"><div className="text-2xl">Loading...</div></div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Voting DApp</h1>
            {isDisconnected ? (
                <div className="text-center">
                    <p className="text-lg mb-4">Please connect to MetaMask</p>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => connect({ connector: connectors.find(c => c.id === 'injected') })}
                    >
                        Connect MetaMask
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-lg mb-6 text-center">Connected account: <span className="font-semibold">{address}</span></p>
                    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <ul>
                            {candidates && candidates.map((candidate, index) => (
                                <li key={index} className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-between items-center">
                                    <div>
                                        <p className="text-xl font-semibold text-black">{candidate.name}</p>
                                        <p className="text-gray-600">Votes: {candidate.voteCount.toString()}</p>
                                    </div>
                                    {!hasVoted && (
                                        <button
                                            className={`ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${selectedCandidate === index ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => setSelectedCandidate(index)}
                                            disabled={selectedCandidate === index}
                                        >
                                            Select
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {!hasVoted ? (
                            <button
                                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                                onClick={handleVote}
                                disabled={selectedCandidate === null || isMining}
                            >
                                {isMining ? 'Submitting...' : 'Submit Vote'}
                            </button>
                        ) : (
                            <p className="text-center text-green-600 font-bold mt-4">You have already voted.</p>
                        )}
                        {txError && <p className="text-red-600 text-center mt-4">Transaction Error: {txError.message}</p>}
                        {isOwner && (
                            <button
                                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                                onClick={handleReset}
                                disabled={isResetting}
                            >
                                {isResetting ? 'Resetting...' : 'Reset Votes'}
                            </button>
                        )}
                        {resetError && <p className="text-red-600 text-center mt-4">Reset Error: {resetError.message}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VotePage;
