import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { SignInForm } from '../components/SignInForm/SignInForm';
import { selectSession } from '../model/slice';

import { makeStore } from '@/store';
import { ThemeModes } from '@/shared/theme/theme';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';

const setup = async () => {
  const store = makeStore();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <ThemeProvider mode={ThemeModes.dark}>{children}</ThemeProvider>
    </Provider>
  );
  await render(<SignInForm />, { wrapper });
  return store;
};

// No artificial network wait in component tests.
jest.mock('../model/constants', () => ({
  ...jest.requireActual('../model/constants'),
  SIGN_IN_DELAY_MS: 0,
}));

describe('SignInForm', () => {
  it('signs in with the demo account', async () => {
    const store = await setup();
    await fireEvent.press(screen.getByRole('button', { name: 'Fill in demo account' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(selectSession(store.getState())?.driverName).toBe('Test Driver'));
  });

  it('marks the identifier field when it is not a phone or email', async () => {
    const store = await setup();
    await fireEvent.changeText(screen.getByLabelText('Phone or email'), 'driver');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'demo1234');
    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByText(/phone with country code/)).toBeOnTheScreen();
    expect(selectSession(store.getState())).toBeNull();
  });

  it('explains wrong credentials and clears the message once the driver edits', async () => {
    await setup();
    await fireEvent.changeText(screen.getByLabelText('Phone or email'), 'someone@depot.test');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'demo1234');
    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Wrong phone, email or password.');

    await fireEvent.changeText(screen.getByLabelText('Password'), 'demo12345');
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
