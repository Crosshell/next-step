import { isoToDate } from '@/utils/convertData';
import classes from './Profile.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '@/services/userService';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authSlice';
import Cookies from 'js-cookie';

interface Props {
  isEditable: boolean;
  data: string;
}

export default function BottomRow({ isEditable, data }: Props) {
  const router = useRouter();
  const { setIsLogged } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      router.push('/sign-in');
      Cookies.remove('sid');
      queryClient.clear();
      setIsLogged(false);
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
