export const STEPPER_FORM_KEYS_FOR_FREELANCER_SETUP = {
  1: [],
  2: ['category', 'specialities'],
  3: ['skills'],
  4: ['title', 'bio'],
  5: ['language', 'englishFluency'],
  6: ['rate', 'isVoluntary'],
  7: [
    'profile_picture',
    'date_of_birth',
    'country',
    'address',
    'state',
    'city',
    'phone',
    'zipcode',
    'fullname',
    'email'
  ],
  8: [],
} as const;

export const ARRAY_FIELDS = ['skills', 'specialities'] as const;
export const FILE_FIELDS = ['profile_picture'] as const;
