import classes from './ErrorItem.module.css';

interface Props {
  message: string;
}

export default function ErrorItem({ message }: Props) {
  return <div className={classes['error-box']}>{message}</div>;
}
