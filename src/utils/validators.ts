import { z } from 'zod';

const bdPhoneRegex = /^01[3-9]\d{8}$/;

export const phoneSchema = z.object({
  phone_number: z
    .string()
    .regex(bdPhoneRegex, 'validation.phoneInvalidExample')
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'validation.otpLength').regex(/^\d+$/, 'validation.otpNumeric')
});

export const signupDetailsSchema = z.object({
  full_name: z.string().min(2, 'validation.fullNameMin').max(150),
  password: z
    .string()
    .min(8, 'validation.passwordMin')
    .regex(/[A-Za-z]/, 'validation.passwordLetter')
    .regex(/\d/, 'validation.passwordNumber'),
  confirm_password: z.string(),
  marketing_consent: z.boolean().default(false),
}).refine(
  (data) => data.password === data.confirm_password,
  { message: 'validation.passwordsMismatch', path: ['confirm_password'] }
);

export const loginSchema = z.object({
  phone_number: z.string().regex(bdPhoneRegex, 'validation.phoneInvalid'),
  password: z.string().min(1, 'validation.passwordRequired'),
});

const eighteenYearsAgo = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d;
};

export const profileStep1Schema = z.object({
  date_of_birth: z
    .string()
    .min(1, 'validation.dobRequired')
    .refine((val) => {
      const dob = new Date(val);
      return dob <= eighteenYearsAgo();
    }, 'validation.dobAdult'),
  district: z.string().min(1, 'validation.districtRequired'),
  thana: z.string().min(1, 'validation.thanaRequired'),
  full_address: z.string().min(5, 'validation.addressInvalid'),
  email: z.string().email('validation.emailInvalid').optional().or(z.literal('')),
  profile_picture: z.instanceof(File).optional().nullable(),
});

export const profileStep2Schema = z.object({
  nid_number: z.string().min(1, 'validation.nidNumberRequired'),
  nid_image: z.instanceof(File, { message: 'validation.nidImageRequired' }),
  institutional_id_image: z.instanceof(File).optional().nullable(),
});
