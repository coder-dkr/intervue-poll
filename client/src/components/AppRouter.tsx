import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setUserInfo, logout } from '../store/slices/authSlice';
import { useSocket } from '../hooks/useSocket';
import RoleSelection from './RoleSelection';
import StudentNameEntry from './StudentNameEntry';
import StudentWaiting from './StudentWaiting';
import TeacherDashboard from './TeacherDashboard';
import PollView from './PollView';
import KickedOutScreen from './KickedOutScreen';

const AppRouter: React.FC = () => {
  const dispatch = useDispatch();
  const { userType, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { currentPoll, isWaitingForQuestion, socket } = useSelector((state: RootState) => state.poll);
  const [isKicked, setIsKicked] = useState(false);

  // Initialize socket connection when user is authenticated
  useSocket();

  // Handle kicked out event
  useEffect(() => {
    if (socket) {
      socket.on('kicked', () => {
        setIsKicked(true);
        dispatch(logout());
      });

      return () => {
        socket.off('kicked');
      };
    }
  }, [socket, dispatch]);

    // Handle teacher auto-authentication
    useEffect(() => {
      if (userType === 'teacher' && !isAuthenticated) {
        const teacherId = 'teacher-' + Date.now();
        dispatch(setUserInfo({
          id: teacherId,
          name: 'Teacher',
          userType: 'teacher'
        }));
      }
    }, [userType, isAuthenticated, dispatch]);

  // Show kicked out screen
  if (isKicked) {
    return <KickedOutScreen />;
  }

  // Role selection
  if (!userType) {
    return <RoleSelection />;
  }

  // Student flow
  if (userType === 'student') {
    if (!isAuthenticated) {
      return <StudentNameEntry />;
    }
    
    if (currentPoll) {
      return <PollView />;
    }
    if(isWaitingForQuestion)  return <StudentWaiting />;
    return <div>NOTHING HERE</div>
  }

  // Teacher flow
  if (userType === 'teacher') {
    if (currentPoll) {
      return <PollView />;
    }
    
    return <TeacherDashboard />;
  }

  return <RoleSelection />;
};

export default AppRouter;