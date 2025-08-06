import { isoToDate } from '@/utils/convertData';
import classes from './Profile.module.css';
import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authSlice';

interface Props {
  isEditable: boolean;
  data: string;
}

export default function BottomRow({ isEditable, data }: Props) {
  const router = useRouter();
  const { setIsLogged, setIsConfirmed } = useAuthStore();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      router.push('/sign-in');
      setIsLogged(false);
      setIsConfirmed(false);
    },
    onError: (err) => {
      console.error('Logout failed:', err);
    },
  });

  const handleLogoutAll = () => {
    const confirmLogout = window.confirm(
      'Are you sure you want to log out from all devices?'
    );
    if (!confirmLogout) return;

    logoutMutate();
  };

  return (
    <div className="row-space-between">
      <h3 className={classes['created-at']}>
        With us from: <span>{isoToDate(data)}</span>
      </h3>
      {isEditable && (
        <button className={classes['logout-btn']} onClick={handleLogoutAll}>
          Log out from all devices
        </button>
      )}
    </div>
  );
}
