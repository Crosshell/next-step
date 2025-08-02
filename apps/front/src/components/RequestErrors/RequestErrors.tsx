import MessageBox from '../MessageBox/MessageBox';
import classes from './RequestErrors.module.css';

interface Props {
  errors: string[];
}

export default function RequestErrors({ errors }: Props) {
  return (
    <>
      {errors.length > 0 && (
        <div className={classes['request-error-container']}>
          {errors.map((error) => (
            <MessageBox key={error}>{error}</MessageBox>
          ))}
        </div>
      )}
    </>
  );
}
