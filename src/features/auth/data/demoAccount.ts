/**
 * The one mock account. The driver id and name match the bundled schedule,
 * so signing in shows that driver's assignments. Not a secret: the sign-in
 * screen offers to fill it in.
 */
export const DEMO_ACCOUNT = {
  driverId: 'drv-014',
  driverName: 'Test Driver',
  email: 'driver@depot.test',
  phone: '+491512345678',
  /** How the phone is shown and typed by the demo button. */
  phoneDisplay: '+49 151 2345678',
  password: 'demo1234',
} as const;
