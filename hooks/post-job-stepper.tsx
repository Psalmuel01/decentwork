import {
  STEPPER_FORM_KEYS_FOR_POST_JOB_STEPS,
  POST_JOB_ARRAY_FIELDS,
} from '../constants/post-job-stepper-constant';
type ArrayFields = (typeof POST_JOB_ARRAY_FIELDS)[number];

export type PostJobStepperFormKeysType =
  (typeof STEPPER_FORM_KEYS_FOR_POST_JOB_STEPS)[keyof typeof STEPPER_FORM_KEYS_FOR_POST_JOB_STEPS][number];

export type PostJobStepperFormValues = {
  [FieldName in PostJobStepperFormKeysType]: FieldName extends ArrayFields
    ? string[]
    : FieldName extends 'budget'
      ? number
      : string;
};
