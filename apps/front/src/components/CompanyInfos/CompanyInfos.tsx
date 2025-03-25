import CompanyInfoBox from './CompanyInfoBox';

import classes from './CompanyInfos.module.css';

export default function CompanyInfos() {
  return (
    <ul className={classes['companies-container']}>
      <li>
        <CompanyInfoBox />
      </li>
      <li>
        <CompanyInfoBox />
      </li>
      <li>
        <CompanyInfoBox />
      </li>
      <li>
        <CompanyInfoBox />
      </li>
      <li>
        <CompanyInfoBox />
      </li>
      <li>
        <CompanyInfoBox />
      </li>
      <li>
        <CompanyInfoBox />
      </li>
      <li>
        <CompanyInfoBox />
      </li>
    </ul>
  );
}
