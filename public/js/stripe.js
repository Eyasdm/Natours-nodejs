/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51T6xbyD7KYdqJ886u6cwoPvVI7EnepJGabpkNvccO1J8DQ2umdPV13Ei7zuXl9iCqoOyqivzIEHxXddqK38atYat005uhLStmx',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + chance credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);

    showAlert('error', err.response.data.message);
  }
};
