import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { RootState } from '../store/store';
import { setSocket, setCurrentPoll, updatePollResults, setParticipants, updateParticipantAnswer, setTimeRemaining, endPoll, removeParticipant } from '../store/slices/pollSlice';
import { addMessage, setMessages } from '../store/slices/chatSlice';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { userId, userName, userType } = useSelector((state: RootState) => state.auth);
  const { socket } = useSelector((state: RootState) => state.poll);

  useEffect(() => {
    if (userId && !socket) {
      const newSocket = io('http://localhost:5001', {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

       // Connection events
       newSocket.on('connect', () => {
        console.log('Connected to Socket.IO server with ID:', newSocket.id);
        dispatch(setSocket(newSocket));

        // Only emit join after connection is established
        newSocket.emit('join', { userId, userName, userType }, (response: { error?: string } | undefined) => {
          if (response?.error) {
            console.error('Join error:', response.error);
          }
        });
      });


      newSocket.on('connect_error', (err) => {
        console.error('Connection error:', err.message);
      });


      // dispatch(setSocket(newSocket));

      // newSocket.emit('join', { userId, userName, userType });

      newSocket.on('newPoll', (poll) => {
        dispatch(setCurrentPoll(poll));
      });

      newSocket.on('pollResults', (results) => {
        dispatch(updatePollResults(results));
      });

      newSocket.on('participantsUpdate', (participants) => {
        dispatch(setParticipants(participants));
      });

      newSocket.on('participantAnswered', ({ userId, hasAnswered }) => {
        dispatch(updateParticipantAnswer({ userId, hasAnswered }));
      });

      newSocket.on('timeUpdate', (timeRemaining) => {
        dispatch(setTimeRemaining(timeRemaining));
      });

      newSocket.on('pollEnded', () => {
        dispatch(endPoll());
      });

      newSocket.on('chatMessage', (message) => {
        dispatch(addMessage(message));
      });

      newSocket.on('chatHistory', (messages) => {
        dispatch(setMessages(messages));
      });

      newSocket.on('participantRemoved', (participantId) => {
        dispatch(removeParticipant(participantId));
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      newSocket.connect();

      return () => {
        newSocket.off('connect');
        newSocket.off('connect_error');
        newSocket.close();
      };
    }
  }, [userId, socket, dispatch, userName, userType]);

  return socket;
};