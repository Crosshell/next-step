import { useState } from 'react';
import { Field, Form, Formik } from 'formik';

import AnimatedIcon from '@/components/HoveredItem/HoveredItem';
import MessageBox from '../MessageBox/MessageBox';

import { faCheck, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import classes from './CompanyProfile.module.css';
import profileClasses from '../ProfileItems/Profile.module.css';

import { MainInfoData } from '@/types/companyProfile';
import { validateCompanyInfoData } from '@/utils/companyProfileValidation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCompanyProfile } from '@/services/companyProfileService';

interface Props {
  isEditable?: boolean;
  data: MainInfoData;
}

export default function CompanyMainInfo({ isEditable, data }: Props) {
  const [isChanging, setIsChanging] = useState(false);
  const [requestError, setRequestError] = useState<string | null>();

  const queryClient = useQueryClient();

  const { mutate: updateInfo, isPending } = useMutation({
    mutationFn: updateCompanyProfile,
    onSuccess: async (result) => {
      if (result.status === 'error') {
        setRequestError(result.error);
        return;
      }
      setRequestError(null);
      await queryClient.invalidateQueries({ queryKey: ['company-profile'] });
      setIsChanging(false);
    },
  });

  return (
    <>
      {!isChanging ? (
        <div className={classes['main-info-data']}>
          <h2>{data.name}</h2>
          <p>
            {isEditable ? 'Your w' : 'W'}ebsite:{' '}
            <span className="underline-link">
              {data.url ? data.url : 'no url there yet'}
            </span>
          </p>

          {isEditable && (
            <button
              className={classes['edit-main-info-btn']}
              onClick={() => setIsChanging(true)}
            >
              <AnimatedIcon iconType={faPencil} />
            </button>
          )}
        </div>
      ) : (
        <Formik
          initialValues={data}
          validate={validateCompanyInfoData}
          onSubmit={(values) => {
            console.log(values);
            updateInfo(values);
          }}
        >
          {({ errors }) => (
            <Form className={profileClasses['info-form']}>
              <div className={profileClasses['personal-info']}>
                <Field
                  className={classes['name-input']}
                  name="name"
                  type="text"
                  placeholder="Company Name"
                />
                <Field
                  className={classes['url-input']}
                  name="url"
                  type="text"
                  placeholder="Website url"
                />
              </div>

              {Object.keys(errors).length > 0 && (
                <div
                  className={profileClasses['personal-info-error-container']}
                >
                  {Object.values(errors).map((err) => (
                    <MessageBox key={err}>{err}</MessageBox>
                  ))}
                </div>
              )}

              {requestError && (
                <div className={classes['personal-info-error-container']}>
                  <MessageBox>{requestError}</MessageBox>
                </div>
              )}

              <div className={profileClasses['personal-info-btn-container']}>
                <button
                  className={profileClasses['personal-info-btn-cross']}
                  type="button"
                  onClick={() => setIsChanging(false)}
                >
                  <AnimatedIcon iconType={faXmark} />
                </button>
                <button
                  className={profileClasses['personal-info-btn']}
                  type="submit"
                  disabled={isPending}
                >
                  <AnimatedIcon iconType={faCheck} />
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}
