import MessageBox from '../MessageBox/MessageBox';
import classes from './RequestErrors.module.css';

interface Props {
  error: string | null;
}

export default function RequestErrors({ error }: Props) {
  return (
    <>
      {error && (
        <div className={classes['request-error-container']}>
          <MessageBox>{error}</MessageBox>
        </div>
      )}
    </>
  );
}
